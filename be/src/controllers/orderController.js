const Order = require("../models/order");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const AddNewOrder = async (req, res) => {
  const {
    id_user,
    id_hotel,
    id_room,
    id_vehicle,
    check_in,
    check_out,
    start_date,
    end_date,
    total,
    payment_method,
    paymented,
    status,
    created_at,
    updated_at,
  } = req.body;
  const newOrder = new Order({
    id_user,
    id_hotel,
    id_room,
    id_vehicle,
    check_in,
    check_out,
    start_date,
    end_date,
    total,
    payment_method,
    paymented,
    status,
    created_at,
    updated_at,
  });
  try {
    const order = await newOrder.save();
    const user = await User.findById(id_user);
    user.orders.push(order._id);
    await user.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("id_user", "name email phone_number type tokenNotification")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdHotel = async (req, res) => {
  try {
    const orders = await Order.find({ id_hotel: req.params.id_hotel })
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdUser = async (req, res) => {
  try {
    const orders = await Order.find({ id_user: req.params.id })
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateOrder = async (req, res) => {
  try {
    const {
      id_user,
      id_room,
      id_hotel,
      id_vehicle,
      check_in,
      check_out,
      total,
      status,
    } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        id_user,
        id_room,
        id_hotel,
        id_vehicle,
        check_in,
        check_out,
        total,
        status,
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Delete order success" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateReview = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.reviewed = true;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const GetOrderByDate = async (req, res) => {
  const { start, end } = req.body;
  try {
    const start1 = new Date(start);
    const end1 = new Date(end);
    const startDate = new Date(start1.toISOString().split("T")[0]);
    const endDate = new Date(end1.toISOString().split("T")[0]);
    const orders = await Order.find();

    const data = [];

    orders.forEach((order) => {
      const check_in1 = new Date(order.check_in);
      const check_inDate = new Date(check_in1.toISOString().split("T")[0]);
      if (
        check_inDate >= startDate &&
        check_inDate <= endDate &&
        order.paymented
      ) {
        data.push(order);
      }
    });

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderHotelByDate = async (req, res) => {
  const { id_hotel, start, end } = req.body;
  try {
    const start1 = new Date(start);
    const end1 = new Date(end);
    const startDate = new Date(start1.toISOString().split("T")[0]);
    const endDate = new Date(end1.toISOString().split("T")[0]);
    // find by id hotel
    const orders = await Order.find({ id_hotel: id_hotel });

    const data = [];

    orders.forEach((order) => {
      const check_in1 = new Date(order.check_in);
      const check_inDate = new Date(check_in1.toISOString().split("T")[0]);
      if (
        check_inDate >= startDate &&
        check_inDate <= endDate &&
        order.paymented
      ) {
        data.push(order);
      }
    });

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderHotelByQuarter = async (req, res) => {
  const { id_hotel, quarter } = req.body;
  try {
    const orders = await Order.find({ id_hotel: id_hotel });
    var monthNames =
      quarter === 1
        ? ["Jan", "Feb", "Mar"]
        : quarter === 2
        ? ["Apr", "May", "Jun"]
        : quarter === 3
        ? ["Jul", "Aug", "Sep"]
        : ["Oct", "Nov", "Dec"];

    const data = [
      {
        year: 2021,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
      {
        year: 2022,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
      {
        year: 2023,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
    ];

    const checkQuarter = (date, quarter) => {
      const month = date.getMonth();
      if (quarter == 1) {
        if (month >= 1 && month <= 3) {
          return true;
        }
      }
      if (quarter == 2) {
        if (month >= 4 && month <= 6) {
          return true;
        }
      }
      if (quarter == 3) {
        if (month >= 7 && month <= 9) {
          return true;
        }
      }
      if (quarter == 4) {
        if (month >= 10 && month <= 12) {
          return true;
        }
      }
      return false;
    };

    const getindex = (month) => {
      switch (quarter) {
        case 1:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 2:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 3:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 4:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        default:
          break;
      }
    };
    orders.forEach((order) => {
      const check_in1 = new Date(order.check_in);
      const check_inDate = new Date(check_in1.toISOString().split("T")[0]);
      if (check_inDate.getFullYear() == 2021) {
        if (checkQuarter(check_inDate, quarter)) {
          data[0].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[0].totalQuarter += order.total;
        }
      } else if (check_inDate.getFullYear() == 2022) {
        if (checkQuarter(check_inDate, quarter)) {
          data[1].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[1].totalQuarter += order.total;
        }
      } else if (check_inDate.getFullYear() == 2023) {
        if (checkQuarter(check_inDate, quarter)) {
          data[2].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[2].totalQuarter += order.total;
        }
      }
    });

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByQuarter = async (req, res) => {
  const { quarter } = req.body;
  try {
    const orders = await Order.find();
    var monthNames =
      quarter === 1
        ? ["Jan", "Feb", "Mar"]
        : quarter === 2
        ? ["Apr", "May", "Jun"]
        : quarter === 3
        ? ["Jul", "Aug", "Sep"]
        : ["Oct", "Nov", "Dec"];

    const data = [
      {
        year: 2021,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
      {
        year: 2022,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
      {
        year: 2023,
        month: [
          {
            name: monthNames[0],
            total: 0,
          },
          {
            name: monthNames[1],
            total: 0,
          },
          {
            name: monthNames[2],
            total: 0,
          },
        ],
        totalQuarter: 0,
      },
    ];

    const checkQuarter = (date, quarter) => {
      const month = date.getMonth();
      if (quarter == 1) {
        if (month >= 1 && month <= 3) {
          return true;
        }
      }
      if (quarter == 2) {
        if (month >= 4 && month <= 6) {
          return true;
        }
      }
      if (quarter == 3) {
        if (month >= 7 && month <= 9) {
          return true;
        }
      }
      if (quarter == 4) {
        if (month >= 10 && month <= 12) {
          return true;
        }
      }
      return false;
    };

    const getindex = (month) => {
      switch (quarter) {
        case 1:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 2:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 3:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        case 4:
          if (month == 1 || month == 4 || month == 7 || month == 10) {
            return 0;
          } else if (month == 2 || month == 5 || month == 8 || month == 11) {
            return 1;
          } else if (month == 3 || month == 6 || month == 9 || month == 12) {
            return 2;
          }
          break;
        default:
          break;
      }
    };
    orders.forEach((order) => {
      const check_in1 = new Date(order.check_in);
      const check_inDate = new Date(check_in1.toISOString().split("T")[0]);
      if (check_inDate.getFullYear() == 2021) {
        if (checkQuarter(check_inDate, quarter)) {
          data[0].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[0].totalQuarter += order.total;
        }
      } else if (check_inDate.getFullYear() == 2022) {
        if (checkQuarter(check_inDate, quarter)) {
          data[1].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[1].totalQuarter += order.total;
        }
      } else if (check_inDate.getFullYear() == 2023) {
        if (checkQuarter(check_inDate, quarter)) {
          data[2].month[getindex(check_inDate.getMonth() + 1)].total +=
            order.total;
          data[2].totalQuarter += order.total;
        }
      }
    });

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const ClearAllOrder = async (req, res) => {
  try {
    const users = await User.find();
    
    users.forEach(async (user) => {
      user.orders = [];
      await user.save();
    });
    res
      .status(200)
      .json({ success: true, message: "Clear all order successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  AddNewOrder,
  GetAllOrders,
  GetOrderByIdHotel,
  GetOrderByIdUser,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
  UpdateReview,
  UpdateStatus,
  GetOrderByDate,
  GetOrderByQuarter,
  GetOrderHotelByDate,
  GetOrderHotelByQuarter,
  ClearAllOrder,
};
