//show all the avaible courses
		//show all the avaible courses
		"use client";

		import { useEffect, useState } from "react";
		import Link from "next/link";

		type ChapterType = {
		  _id: string;
		  title: string;
		};

		type CourseType = {
		  _id: string;
		  slug?: string;
		  title: string;
		  description: string;
		  instructor: string;
		  duration: number;
		  price: number;
		  thumbnail?: string;
		  chapters?: ChapterType[];
		};

		export default function CoursesPage() {
		  const [courses, setCourses] = useState<CourseType[]>([]);
		  const [loading, setLoading] = useState(true);

		  useEffect(() => {
		    async function loadCourses() {
		      try {
		        const response = await fetch("/api/courses");
		        const data = await response.json();
		        setCourses(Array.isArray(data) ? data : []);
		      } catch (error) {
		        console.error("Failed to load courses", error);
		      } finally {
		        setLoading(false);
		      }
		    }

		    loadCourses();
		  }, []);

		  return (
		    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white">
		      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
		        <div className="mb-10 max-w-2xl">
		          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Learning hub</p>
		          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Courses</h1>
		          <p className="mt-4 text-sm leading-6 text-white/60">
		            Browse the current course hierarchy. Blog posts can now attach to any course, chapter, or section.
		          </p>
		        </div>

		        {loading ? (
		          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">Loading courses...</div>
		        ) : courses.length === 0 ? (
		          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">No courses found.</div>
		        ) : (
		          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{courses.map((course) => (
							<Link
								key={course._id}
								href={`/courses/${course.slug ?? course._id}`}
								className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/10 block"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<h2 className="text-xl font-semibold text-white">{course.title}</h2>
										<p className="mt-2 text-sm text-white/60">{course.description}</p>
									</div>
									<span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">${course.price}</span>
								</div>

								{course.thumbnail && <img src={course.thumbnail} alt={course.title} className="mt-4 w-full h-40 object-cover rounded-md" />}

								<dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
									<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
										<dt className="text-white/40">Instructor</dt>
										<dd className="mt-1">{course.instructor}</dd>
									</div>
									<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
										<dt className="text-white/40">Duration</dt>
										<dd className="mt-1">{course.duration} hours</dd>
									</div>
								</dl>

								<div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
									<p className="text-xs uppercase tracking-[0.22em] text-white/40">Chapters</p>
									<div className="mt-3 space-y-2">
										{course.chapters && course.chapters.length > 0 ? (
											course.chapters.map((chapter) => (
												<div key={chapter._id} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/75">
													{chapter.title}
												</div>
											))
										) : (
											<p className="text-sm text-white/45">No chapters yet.</p>
										)}
									</div>
								</div>
							</Link>
						))}
		          </div>
		        )}
		      </section>
		    </main>
		  );
		}