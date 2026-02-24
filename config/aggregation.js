//AddFields
db.scores.aggregate([
  {
    $addFields: {
      totalWorkHours: {
        workHour: { sum: 1 },
      },
    },
  },
]);

//Bucket
db.artists.aggregate([
  {
    $bucket: {
      groupBy: "$year_born",
      boundaries: [1840, 1850, 1860, 1870, 1880],
      default: "Other",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);

//Count
db.count.aggregate([
  {
    $match: { score: { $gt: 80 } },
  },
  {
    $count: "passing_score",
  },
]);

//Document
db.locations.aggregate([
  { $match: {} },
  {
    $lookup: {
      localField: "zip",
      foreignField: "zip_id",
      as: "city_state",
      pipeline: [
        {
          $documents: [
            { zip_id: 94301, name: "Palo Alto, CA" },
            { zip_id: 10019, name: "New York, NY" },
          ],
        },
      ],
    },
  },
]);

//Facet
db.products.aggregate([
  {
    $facet: {
      byCategory: [{ $group: { _id: "$category", total: { $sum: 1 } } }],
      priceStats: [
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            avgPrice: { $avg: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ],
    },
  },
]);

//SortByCount
db.products.aggregate([{ $sortByCount: "$category" }]);

// 1️⃣ Find all users from India
db.users.find({ country: "India" });

// 2️⃣ Show only name and role of users
db.users.aggregate([{ $project: { name: 1, role: 1, _id: 0 } }]);

// 3️⃣ Sort users by age (descending)
db.users.aggregate([{ $sort: { age: -1 } }]);

// 4️⃣ Count total number of users
db.users.aggregate([
  {
    $count: "$users",
  },
]);

// 5️⃣ Count how many users per role
db.users.aggregate([{ $group: { _id: "$role", total: { $sum: 1 } } }]);

// 6️⃣ Find orders with status = "completed"
db.orders.aggregate([{ $match: { status: "completed" } }]);

// 7️⃣ Get total number of completed orders
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $count: "total_completed" },
]);

// 8️⃣ Calculate total revenue (sum of all order amounts)
db.orders.aggregate([
  { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
]);

// 9️⃣ Calculate total revenue for completed orders only
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);

// 🔟 Find average order amount
db.orders.aggregate([{ $group: { _id: null, Average: { $avg: "$amount" } } }]);

// 1️⃣1️⃣ Find total amount spent by each user
db.orders.aggregate([
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
]);

// 1️⃣2️⃣ Count number of orders per status
db.orders.aggregate([
  { $group: { _id: "$status" } },
  { $count: "total_count" },
]);

// 1️⃣3️⃣ Find highest order amount
db.orders.aggregate([{ $sort: { amount: -1 } }]);

// 1️⃣4️⃣ Find top 2 highest orders
db.orders.aggregate([{ $sort: { amount: -1 } }, { $limit: 2 }]);

// 1️⃣5️⃣ Count how many times each item was purchased
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
]);

// 1️⃣6️⃣ Find most purchased item
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 1 },
]);

// 1️⃣7️⃣ Count total number of items sold
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: null, total: { $sum: 1 } } },
]);

// 1️⃣8️⃣ Join orders with users and show:
// user name
// order amount
// status
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
  {
    $unwind: "$orders",
  },
  {
    $project: {
      _id: 0,
      name: 1,
      amount: 1,
      status: 1,
    },
  },
]);

// 1️⃣9️⃣ Find total amount spent by each user (with user name)
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
  { $unwind: "$orders" },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      total_spend: { $sum: "$orders.amount" },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      total_spend: 1,
    },
  },
]);

//users
// {
//   _id: 3,
//   name: 'John',
//   role: 'teacher',
//   age: 32,
//   country: 'USA',
//   createdAt: 2023-12-20T00:00:00.000Z
// }

//orders
// {
//   _id: 103,
//   userId: 3,
//   amount: 1200,
//   status: 'completed',
//   items: [
//     'laptop'
//   ],
//   createdAt: 2024-06-15T00:00:00.000Z
// }

// 2️⃣1️⃣ Find total revenue per country
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
  {
    $unwind: "$orders",
  },
  {
    $group: {
      _id: "$country",
      totalRevenue: { $sum: "$orders.amount" },
    },
  },
]);

// 2️⃣2️⃣ Find users who never placed any order
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
  {
    $match: {
      orders: { $size: 0 },
    },
  },
]);

// 2️⃣3️⃣ Find month-wise revenue
db.orders.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      totalRevenue: { $sum: "$amount" },
    },
  },
  {
    $sort: { _id: 1 },
  },
]);

// 2️⃣4️⃣ Find top spending user

// 2️⃣5️⃣ Create a summary collection using $merge:

// Store totalSpent per user in new collection user_summary

db.users.aggregate([
  {
    $group: {
      _id: "$role",
      names: { $push: "$$ROOT" },
    },
  },
]);

//users
// {
//   _id: 3,
//   name: 'John',
//   role: 'teacher',
//   age: 32,
//   country: 'USA',
//   createdAt: 2023-12-20T00:00:00.000Z
// }

// give count per age of male teacher
db.users.aggregate([
  { $match: { role: "teacher" } },
  { $group: { _id: "$age", totalTeachers: { $sum: 1 } } },
]);

// give count per age of male student and sort them by count in desc manner
db.users.aggregate([
  {
    $match: { gender: "male" },
  },
  {
    $group: { _id: "$age", total: { $sum: 1 } },
  },
  {
    $sort: { total: -1 },
  },
]);

// Find total revenue generated.
db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
]);

// Find average order value.
db.orders.aggregate([
  {
    $group: {
      _id: null,
      averageOrderValue: { $avg: "$totalAmount" },
    },
  },
]);

// Find minimum and maximum order amount.
db.orders.aggregate([
  {
    $group: {
      _id: null,
      minimumOrderAmount: { $min: "$totalAmount" },
      maximumOrderAmount: { $max: "$totalAmount" },
    },
  },
]);

// Count total number of orders.
// db.orders.aggregate([
//   {
//     $group: {
//       _id: null,
//       totalOrders: {$count: {}  }
//     }
//   }
// ])
db.orders.countDocuments();

// Get total quantity sold.
db.orders.aggregate([
  {
    $group: {
      _id: null,
      totalQuantity: { $sum: "$quantity" },
    },
  },
]);

// Find total revenue per user.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
]);

// Find total revenue per month.
db.orders.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
]);

// Find total revenue per product.
db.orders.aggregate([
  {
    $group: {
      _id: "$productId",
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
]);

// Find total quantity sold per product.
db.orders.aggregate([
  {
    $group: {
      _id: "$productId",
      totalQuantity: { $sum: "$quantity" },
    },
  },
]);

// Find average order amount per user.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      averageOrder: { $avg: "$totalAmount" },
    },
  },
]);

// Join users with orders.
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
]);

// Show user name and their total spending.
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders",
    },
  },
  {
    $unwind: "$orders",
  },
  {
    $group: {
      _id: "$_id",
      totalSpending: { $sum: "$orders.totalAmount" },
    },
  },
]);

// Join orders with products.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "products",
    },
  },
]);

// Show product name with total quantity sold.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "products",
    },
  },
  {
    $unwind: "$products",
  },
  {
    $group: {
      _id: "$products.name",
      totalQuantity: { $sum: "$quantity" },
    },
  },
  {
    $project: {
      name: 1,
      totalQuantity: 1,
    },
  },
]);

// Show user name, product name, and order amount together.
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "users",
    },
  },
  {
    $unwind: "$users",
  },
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "products",
    },
  },
  {
    $unwind: "$products",
  },
  {
    $project: {
      totalAmount: 1,
      "users.name": 1,
      "products.name": 1,
    },
  },
]);

// Add a field called year from createdAt.
db.orders.aggregate([
  {
    $addFields: {
      Year: { $year: "$createdAt" },
    },
  },
]);

// Show only name and total spending.
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $group: {
      _id: "$user._id",
      name: { $first: "$user.name" },
      totalSpending: { $sum: "$totalAmount" },
    },
  },
  {
    $project: {
      name: 1,
      _id: 0,
      totalSpending: 1,
    },
  },
]);

// Add a discount field (10% of totalAmount).
db.orders.aggregate([
  {
    $addFields: {
      discount: { $multiply: ["$totalAmount", 0.1] },
    },
  },
]);

// Calculate final amount after discount.
db.orders.aggregate([
  {
    $addFields: {
      discount: { $multiply: ["$totalAmount", 0.1] },
    },
  },
  {
    $addFields: {
      finalAmount: { $subtract: ["$totalAmount", "$discount"] },
    },
  },
]);

// Project formatted month name.
db.orders.aggregate([
  {
    $project: {
      monthName: {
        $dateToString: { format: "%B", date: "$createdAt" },
      },
      totalAmount: 1,
    },
  },
]);

// Get users with all their orders expanded.
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "order",
    },
  },

  {
    $unwind: "$order",
  },
]);

// Find highest order per user.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      orders: { $max: "$totalAmount" },
    },
  },
]);

// Find lowest order per user.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      orders: { $min: "$totalAmount" },
    },
  },
]);

// Find top 2 highest spending users.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      totalSpend: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: { totalSpend: -1 },
  },
  {
    $limit: 2,
  },
]);

// Find most sold product category.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product",
    },
  },
  {
    $unwind: "$product",
  },

  {
    $group: {
      _id: "$productId",
      name: { $first: "$product.name" },
      totalSpend: { $sum: "$totalAmount" },
    },
  },
  {
    $sort: { totalSpend: -1 },
  },
  {
    $limit: 1,
  },
  {
    $project: {
      totalSpend: 1,
      "product.name": 1,
    },
  },
]);

// Group revenue by city.
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "order",
    },
  },
  {
    $unwind: "$order",
  },
  {
    $group: {
      _id: "$city",
      totalRevenue: { $sum: "$order.totalAmount" },
    },
  },
]);

// Use $facet to get:
// total revenue
// total orders
// average order value
db.orders.aggregate([
  {
    $facet: {
      totalRevenue: [
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ],
      totalOrders: [
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
          },
        },
      ],
      averageOrder: [
        {
          $group: {
            _id: null,
            averageOrder: { $avg: "$totalOrders" },
          },
        },
      ],
    },
  },
]);

// Bucket users by age range.
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [10, 20, 30, 40, 50],
      default: "Others",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);

// Find revenue trend month-wise.
db.orders.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      revenue: { $sum: "$totalAmount" },
    },
  },
]);

// Find customers who spent more than 50,000.
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      total: { $sum: "$totalAmount" },
    },
  },
  {
    $match: { total: { $gt: 50000 } },
  },
]);
