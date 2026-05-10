"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "./Editor";

type Props = {
  initialData?: any;
  slug?: string;
};

type SectionType = {
  _id: string;
  title: string;
  content: string;
  chapterId: string;
};

type ChapterType = {
  _id: string;
  title: string;
  courseId: string;
  sections?: SectionType[];
};

type CourseType = {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  chapters?: ChapterType[];
};

const apiHeaders = {
  "Content-Type": "application/json",
};

export default function BlogEditor({ initialData, slug }: Props) {
  const initialContent =
    typeof initialData?.content === "string" ? initialData.content : "";

  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [postSlug, setPostSlug] = useState(initialData?.slug || slug || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : ""
  );
  const [published, setPublished] = useState(Boolean(initialData?.published));

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseSelection, setCourseSelection] = useState<string>(
    initialData?.courseId || ""
  );
  const [chapterSelection, setChapterSelection] = useState<string>(
    initialData?.chapterId || ""
  );
  const [sectionSelection, setSectionSelection] = useState<string>(
    initialData?.sectionId || ""
  );

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState("");
  const [newCourseDuration, setNewCourseDuration] = useState("8");
  const [newCoursePrice, setNewCoursePrice] = useState("0");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === courseSelection),
    [courses, courseSelection]
  );

  const chapters = selectedCourse?.chapters || [];
  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter._id === chapterSelection),
    [chapters, chapterSelection]
  );
  const sections = selectedChapter?.sections || [];

  useEffect(() => {
    if (courses.length > 0 && courseSelection && courseSelection !== "new-course" && !selectedCourse) {
      setChapterSelection("");
      setSectionSelection("");
    }
  }, [courses, courseSelection, selectedCourse]);

  async function handleEditorSave(content: string) {
    setSaving(true);
    try {
      let resolvedCourseId = courseSelection && courseSelection !== "new-course" ? courseSelection : "";
      let resolvedChapterId = chapterSelection && chapterSelection !== "new-chapter" ? chapterSelection : "";
      let resolvedSectionId = sectionSelection && sectionSelection !== "new-section" ? sectionSelection : "";

      const shouldCreateNewCourse = courseSelection === "new-course";
      const shouldCreateNewChapter = shouldCreateNewCourse || chapterSelection === "new-chapter";
      const shouldCreateNewSection = shouldCreateNewCourse || sectionSelection === "new-section";

      if (shouldCreateNewCourse) {
        const courseResponse = await fetch("/api/courses", {
          method: "POST",
          headers: apiHeaders,
          credentials: "same-origin",
          body: JSON.stringify({
            title: newCourseTitle || title || "Untitled course",
            description: newCourseDescription || `${title || "Untitled"} course`,
            instructor: newCourseInstructor || "Admin",
            duration: Number(newCourseDuration) || 1,
            price: Number(newCoursePrice) || 0,
          }),
        });

        const createdCourse = await courseResponse.json();
        if (!courseResponse.ok) {
          throw new Error(createdCourse.error || "Failed to create course");
        }

        resolvedCourseId = createdCourse._id;
        setCourses((currentCourses) => [...currentCourses, createdCourse]);
      }

      if (shouldCreateNewChapter && resolvedCourseId) {
        const chapterResponse = await fetch(`/api/courses/${resolvedCourseId}/chapters`, {
          method: "POST",
          headers: apiHeaders,
          credentials: "same-origin",
          body: JSON.stringify({
            title:
              newChapterTitle ||
              (shouldCreateNewCourse
                ? `${newCourseTitle || title || "Untitled"} chapter`
                : `${title || "Untitled"} chapter`),
          }),
        });

        const createdChapter = await chapterResponse.json();
        if (!chapterResponse.ok) {
          throw new Error(createdChapter.error || "Failed to create chapter");
        }

        resolvedChapterId = createdChapter._id;
        setCourses((currentCourses) =>
          currentCourses.map((course) =>
            course._id === resolvedCourseId
              ? { ...course, chapters: [...(course.chapters || []), createdChapter] }
              : course
          )
        );
      }

      if (shouldCreateNewSection && resolvedCourseId && resolvedChapterId) {
        const sectionResponse = await fetch(
          `/api/courses/${resolvedCourseId}/chapters/${resolvedChapterId}/sections`,
          {
            method: "POST",
            headers: apiHeaders,
            credentials: "same-origin",
            body: JSON.stringify({
              title:
                newSectionTitle ||
                (shouldCreateNewCourse
                  ? `${newCourseTitle || title || "Untitled"} section`
                  : `${title || "Untitled"} section`),
              content,
            }),
          }
        );

        const createdSection = await sectionResponse.json();
        if (!sectionResponse.ok) {
          throw new Error(createdSection.error || "Failed to create section");
        }

        resolvedSectionId = createdSection._id;
        setCourses((currentCourses) =>
          currentCourses.map((course) =>
            course._id === resolvedCourseId
              ? {
                  ...course,
                  chapters: (course.chapters || []).map((chapter) =>
                    chapter._id === resolvedChapterId
                      ? { ...chapter, sections: [...(chapter.sections || []), createdSection] }
                      : chapter
                  ),
                }
              : course
          )
        );
      }

      const payload = {
        authorEmail: "gk022135@gmail.com",
        title: title || "Untitled",
        courseId: resolvedCourseId || undefined,
        chapterId: resolvedChapterId || undefined,
        sectionId: resolvedSectionId || undefined,
        slug:
          postSlug ||
          (title
            ? title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            : ""),
        content,
        coverImage,
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        published,
      };

      const res = await fetch(`/api/blogs${slug ? `/${slug}` : ""}`, {
        method: slug ? "PUT" : "POST",
        headers: apiHeaders,
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();
      if (!res.ok) {
        throw new Error(responseBody.error || "Save failed");
      }

      alert("Saved");
    } catch (error: any) {
      alert(error.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/80">
              Content desk
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Post settings
            </h2>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
            {published ? "Ready to publish" : "Draft mode"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <input
            value={postSlug}
            onChange={(e) => setPostSlug(e.target.value)}
            placeholder="Slug (optional)"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image URL"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 md:col-span-2"
          />

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />

          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-sm text-white/80">Publish article</span>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-white"
            />
          </label>

          <label className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-3 md:col-span-2">
            <span className="text-sm text-white/80">Course</span>
            <select
              value={courseSelection}
              onChange={(e) => {
                setCourseSelection(e.target.value);
                setChapterSelection("");
                setSectionSelection("");
              }}
              className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value="">No course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
              <option value="new-course">Create New Course</option>
            </select>
          </label>

          {courseSelection === "new-course" && (
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-500/5 p-4 md:col-span-2 md:grid-cols-2">
              <input
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="New course title"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <input
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                placeholder="Instructor"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <input
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                placeholder="Course description"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 md:col-span-2"
              />
              <input
                value={newCourseDuration}
                onChange={(e) => setNewCourseDuration(e.target.value)}
                type="number"
                min="1"
                placeholder="Duration"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <input
                value={newCoursePrice}
                onChange={(e) => setNewCoursePrice(e.target.value)}
                type="number"
                min="0"
                placeholder="Price"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <input
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Chapter title for the new course"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 md:col-span-2"
              />
              <input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section title for the new course"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 md:col-span-2"
              />
            </div>
          )}

          {courseSelection && courseSelection !== "new-course" && (
            <label className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-3 md:col-span-2">
              <span className="text-sm text-white/80">Chapter</span>
              <select
                value={chapterSelection}
                onChange={(e) => {
                  setChapterSelection(e.target.value);
                  setSectionSelection("");
                }}
                className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
              >
                <option value="">No chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
                <option value="new-chapter">Create New Chapter</option>
              </select>
            </label>
          )}

          {chapterSelection === "new-chapter" && (
            <input
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="New chapter title"
              className="w-full rounded-lg border border-cyan-300/20 bg-cyan-500/5 px-4 py-3 text-sm text-white placeholder-white/40 md:col-span-2"
            />
          )}

          {chapterSelection && chapterSelection !== "new-chapter" && (
            <label className="flex flex-col gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-3 md:col-span-2">
              <span className="text-sm text-white/80">Section</span>
              <select
                value={sectionSelection}
                onChange={(e) => setSectionSelection(e.target.value)}
                className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30"
              >
                <option value="">No section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.title}
                  </option>
                ))}
                <option value="new-section">Create New Section</option>
              </select>
            </label>
          )}

          {sectionSelection === "new-section" && (
            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="New section title"
              className="w-full rounded-lg border border-cyan-300/20 bg-cyan-500/5 px-4 py-3 text-sm text-white placeholder-white/40 md:col-span-2"
            />
          )}
        </div>
      </div>

      <Editor onSave={handleEditorSave} initialData={initialContent} />

      {saving && (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          Saving changes…
        </div>
      )}
    </section>
  );
}