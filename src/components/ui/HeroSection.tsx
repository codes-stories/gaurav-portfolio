"use client";
import Image from "next/image";
import profilepic from "../../Assets/Gaurav Profile bst.jpg";
import React, { useEffect } from "react";

export default function About() {
  const [gitHubData, setGitHubData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [leetCodeData, setLeetCodeData] = React.useState<any>(null);

  useEffect(() => {
    const githubcall = async () => {
      fetch("https://api.github.com/users/gk022135")
        .then((response) => response.json())
        .then((data) => {
          setGitHubData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching GitHub data:", error);
          setLoading(false);
        });
    };

    const leetcodcall = async () => {
      fetch("https://leetcode-stats-api.herokuapp.com/Gaurav_krrr")
        .then((response) => response.json())
        .then((data) => {
          setLeetCodeData(data);
        })
        .catch((error) => {
          console.error("Error fetching LeetCode data:", error);
        });
    };

    githubcall();
    leetcodcall();
  }, []);

  return (
    <section
      id="about"
      className="relative bg-black text-white py-24 overflow-hidden"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="mb-16 text-center">
         
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Left Profile Card */}
          <div className="flex flex-col">
            <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 overflow-hidden group">
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="relative w-44 h-44 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all duration-500">
                    <Image
                      src={profilepic}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-3xl font-bold">{gitHubData?.name || "Gaurav"}</h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    Software Engineer
                  </p>
                  <p className="text-xs text-zinc-500">
                    Full-Stack Developer (Backend Focused)
                  </p>
                  {gitHubData?.location && (
                    <p className="text-xs text-zinc-500 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {gitHubData.location}
                    </p>
                  )}
                </div>

                {gitHubData?.bio && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-400 italic leading-relaxed whitespace-pre-line">
                      "{gitHubData.bio}"
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-zinc-400 group/item hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-xs">gk022135@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 group/item hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-xs">+91 7295976697</span>
                  </div>
                </div>

                <a
                  href="https://docs.google.com/document/d/e/2PACX-1vRmzn8bmRglYrBDDf7kKiY0pw1kO-vkXfNcJ78tK9vgWAPwfudtLHwoKmNq5n3_fw/pub"
                  target="_blank"
                  className="block w-full text-center rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Bio */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  A passionate software engineer focused on building scalable,
                  reliable, and user-centric digital products. I enjoy solving
                  complex problems, learning new technologies, and turning ideas
                  into production-ready systems.
                </p>

                <p>
                  Currently, I'm a{" "}
                  <span className="text-white font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Computer Science student
                  </span>{" "}
                  with hands-on experience in building modern web applications
                  using React, Next.js, Node.js, and TypeScript.
                </p>

                <p>
                  I've worked on projects involving authentication systems, REST
                  APIs, databases, and performance-optimized frontends. I'm
                  particularly interested in system design, backend architecture,
                  and cloud-native development.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Stats */}
              <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/20 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">GitHub</h4>
                      <p className="text-xs text-zinc-500">@{gitHubData?.login || "gk022135"}</p>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
                      <div className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />
                    </div>
                  ) : gitHubData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                          <div className="text-2xl font-bold">{gitHubData.public_repos}</div>
                          <div className="text-xs text-zinc-500 mt-1">Repos</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                          <div className="text-2xl font-bold">{gitHubData.followers}</div>
                          <div className="text-xs text-zinc-500 mt-1">Followers</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                          <div className="text-2xl font-bold">{gitHubData.following}</div>
                          <div className="text-xs text-zinc-500 mt-1">Following</div>
                        </div>
                      </div>
                      <a
                        href={gitHubData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mt-4"
                      >
                        View Profile
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">Failed to load stats</p>
                  )}
                </div>
              </div>

              {/* LeetCode Stats */}
              <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">LeetCode</h4>
                      <p className="text-xs text-zinc-500">Problem Solving</p>
                    </div>
                  </div>
                  
                  {leetCodeData ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-4 border border-orange-500/20">
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                              {leetCodeData.totalSolved}
                            </div>
                            <div className="text-xs text-zinc-400 mt-1">Total Solved</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-zinc-300">
                              Rank #{leetCodeData.ranking?.toLocaleString()}
                            </div>
                            <div className="text-xs text-zinc-500">{leetCodeData.acceptanceRate}% accepted</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors">
                          <div className="text-xl font-bold text-emerald-400">{leetCodeData.easySolved}</div>
                          <div className="text-xs text-zinc-500 mt-1">Easy</div>
                          <div className="text-xs text-zinc-600">/{leetCodeData.totalEasy}</div>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center hover:bg-amber-500/20 transition-colors">
                          <div className="text-xl font-bold text-amber-400">{leetCodeData.mediumSolved}</div>
                          <div className="text-xs text-zinc-500 mt-1">Medium</div>
                          <div className="text-xs text-zinc-600">/{leetCodeData.totalMedium}</div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center hover:bg-red-500/20 transition-colors">
                          <div className="text-xl font-bold text-red-400">{leetCodeData.hardSolved}</div>
                          <div className="text-xs text-zinc-500 mt-1">Hard</div>
                          <div className="text-xs text-zinc-600">/{leetCodeData.totalHard}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {leetCodeData.contributionPoints} points
                        </span>
                        <span>Rep: {leetCodeData.reputation}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                        <div className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
              <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                Skills & Technologies
              </h4>

              <div className="flex flex-wrap gap-3">
                {[
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Node.js",
                  "Express",
                  "MongoDB",
                  "PostgreSQL",
                  "Redis",
                  "Docker",
                  "Git",
                  "Tailwind CSS",
                ].map((skill, index) => (
                  <span
                    key={skill}
                    className="relative group/skill rounded-xl bg-zinc-900/80 border border-white/10 px-5 py-2.5 text-sm text-zinc-300 hover:border-white/30 hover:text-white transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover/skill:from-purple-500/10 group-hover/skill:via-blue-500/10 group-hover/skill:to-purple-500/10 rounded-xl transition-all duration-300" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}