// Total number of orders
db.orders.aggregate([
  {
    $group: { _id: null, count: { $sum: 1 } },
  },
  {
    $project: { _id: 0 },
  },
]);

// Total revenue
db.orders.aggregate([
  {
    $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } },
  },
  {
    $project: { _id: 0 },
  },
]);

// Average order value
db.orders.aggregate([
  {
    $group: { _id: null, averageOrderValue: { $avg: "$totalAmount" } },
  },
  {
    $project: { _id: 0 },
  },
]);

// Orders grouped by status
db.orders.aggregate([
  {
    $group: { _id: "$status" },
  },
]);

// Total users registered this month
db.orders.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      totalUsers: {$sum : 1}
    },
  },
]);

// Top 5 expensive products
db.products.aggregate([
    {
        $sort: {price : -1}
    },
    {
        $limit: 5
    }
])

// Products out of stock
db.products.aggregate([
    {
        $match: {stock: {$lte: 10}}
    },
    {
        $project: {
            name: 1, stock: 1, _id: 0
        }
    }
])