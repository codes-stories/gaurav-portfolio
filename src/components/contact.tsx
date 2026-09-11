"use client"

import { Github, Linkedin, Instagram, Twitter, Mail, Phone, MapPin, Code, Star, Calendar, ExternalLink, ChevronDown, Menu, X } from 'lucide-react';
import ContactForm from './ContactForm';

export const Contact = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Get In Touch
                </h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/20 rounded-full">
                                <Mail size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Email</h3>
                                <p className="text-gray-300">gk022135@email.com</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-500/20 rounded-full">
                                <Phone size={20} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Phone</h3>
                                <p className="text-gray-300">+91 72959 76697</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-500/20 rounded-full">
                                <MapPin size={20} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Location</h3>
                                <p className="text-gray-300">Siwan Bihar, India</p>
                            </div>
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <a href="https://github.com/codes-stories" className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/gauravkrrr/" className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://www.instagram.com/gaurav_krr/" className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://x.com/Gaurav__krrr" className="p-3 bg-blue-400 hover:bg-blue-500 rounded-full transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                    {/* <div className="space-y-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
                            />
                        </div>
                        <button
                            onClick={() => alert('Message sent! (This is a demo)')}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Send Message
                        </button>
                    </div> */}
                    <div className="space-y-6">
                         <ContactForm />
                    </div>

                   
                </div>
            </div>
        </section>
    )
}