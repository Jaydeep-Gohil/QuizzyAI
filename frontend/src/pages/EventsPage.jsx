import React from "react";
import { Calendar, Search, BookOpen, Clock, Users } from "lucide-react";
import { events } from "../data/mockData";

const EventsPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Events</h1>
            <p className="text-gray-400">
              Schedule and manage quiz sessions for your students
            </p>
          </div>
          {/* <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
            <Calendar size={20} />
            Schedule Event
          </button> */}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Event Calendar</h2>
            <div className="flex gap-3">
              {/* <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div> */}
              <select className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700">
                <option>All Quizzes</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
              All Events
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              Active
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              Upcoming
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              Completed
            </button>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-6 bg-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {event.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : event.status === "Upcoming"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{event.desc}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        15 questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        20 min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {event.participants} completions
                      </span>
                      <span className="text-gray-500">Created just now</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`px-6 py-2 rounded-lg font-medium ${
                    event.status === "Active"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-white"
                  } hover:opacity-90`}
                >
                  {event.status === "Active" ? "View Live" : "Manage"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
