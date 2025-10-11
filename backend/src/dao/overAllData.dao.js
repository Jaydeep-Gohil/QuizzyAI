import User from "../models/user.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import mongoose from "mongoose";

export const getDashboardDataDao = async ({ page, limit, skip, filters }) => {
  try {
    // Build search query
    const searchQuery = {};
    if (filters.search) {
      searchQuery.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalStudents = await User.countDocuments({
      role: "student",
      ...searchQuery,
    });

    // Aggregation pipeline to get students with their quiz attempt statistics
    const studentsWithStats = await User.aggregate([
      {
        $match: {
          role: "student",
          ...searchQuery,
        },
      },
      {
        $sort: { [filters.sortBy]: filters.sortOrder },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "quizattempts",
          localField: "_id",
          foreignField: "user",
          as: "attempts",
        },
      },
      {
        $addFields: {
          // Calculate quiz attempt statistics
          quizStats: {
            totalAttempts: { $size: "$attempts" },
            completedAttempts: {
              $size: {
                $filter: {
                  input: "$attempts",
                  as: "attempt",
                  cond: { $eq: ["$$attempt.status", "completed"] },
                },
              },
            },
            inProgressAttempts: {
              $size: {
                $filter: {
                  input: "$attempts",
                  as: "attempt",
                  cond: { $eq: ["$$attempt.status", "in-progress"] },
                },
              },
            },
            // Calculate total points from all completed attempts
            totalPoints: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$attempts",
                      as: "attempt",
                      cond: { $eq: ["$$attempt.status", "completed"] },
                    },
                  },
                  as: "attempt",
                  in: { $ifNull: ["$$attempt.score.obtained", 0] },
                },
              },
            },
            averageScore: {
              $cond: {
                if: {
                  $and: [
                    { $gt: [{ $size: "$attempts" }, 0] },
                    {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$attempts",
                              as: "attempt",
                              cond: { $eq: ["$$attempt.status", "completed"] },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$attempts",
                              as: "attempt",
                              cond: { $eq: ["$$attempt.status", "completed"] },
                            },
                          },
                          as: "attempt",
                          in: { $ifNull: ["$$attempt.score.percentage", 0] },
                        },
                      },
                    },
                    2,
                  ],
                },
                else: 0,
              },
            },
            totalTimeSpent: {
              $sum: {
                $map: {
                  input: "$attempts",
                  as: "attempt",
                  in: { $ifNull: ["$$attempt.timeSpent", 0] },
                },
              },
            },
            passedQuizzes: {
              $size: {
                $filter: {
                  input: "$attempts",
                  as: "attempt",
                  cond: {
                    $and: [
                      { $eq: ["$$attempt.status", "completed"] },
                      { $eq: ["$$attempt.passed", true] },
                    ],
                  },
                },
              },
            },
            failedQuizzes: {
              $size: {
                $filter: {
                  input: "$attempts",
                  as: "attempt",
                  cond: {
                    $and: [
                      { $eq: ["$$attempt.status", "completed"] },
                      { $eq: ["$$attempt.passed", false] },
                    ],
                  },
                },
              },
            },
            lastAttemptDate: {
              $max: "$attempts.createdAt",
            },
          },
        },
      },
      {
        $lookup: {
          from: "quizattempts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$userId"] },
                status: "completed",
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 5,
            },
            {
              $lookup: {
                from: "quizzes",
                localField: "quiz",
                foreignField: "_id",
                as: "quizDetails",
              },
            },
            {
              $unwind: {
                path: "$quizDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                quizId: "$quiz",
                quizTitle: "$quizDetails.title",
                category: "$quizSnapshot.category",
                difficulty: "$quizSnapshot.difficulty",
                score: "$score.percentage",
                pointsEarned: "$score.obtained",
                passed: "$passed",
                timeSpent: "$timeSpent",
                completedAt: "$completedAt",
                correctAnswers: "$correctAnswers",
                wrongAnswers: "$wrongAnswers",
                totalQuestions: "$quizSnapshot.totalQuestions",
              },
            },
          ],
          as: "recentAttempts",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePic: 1,
          createdAt: 1,
          isVerified: 1,
          quizStats: 1,
          recentAttempts: 1,
        },
      },
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalStudents / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      students: studentsWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents,
        studentsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard data: ${error.message}`);
  }
};
