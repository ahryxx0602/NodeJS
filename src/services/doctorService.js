import db from "../models/index";
require("dotenv").config();
import _, { reject } from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveDetailInfoDoctor = (InputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !InputData.doctorId ||
        !InputData.contentHTML ||
        !InputData.contentMarkdown ||
        !InputData.action ||
        !InputData.selectedPrice ||
        !InputData.selectedPayment ||
        !InputData.selectedProvince ||
        !InputData.nameClinic ||
        !InputData.addressClinic ||
        !InputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        //UPSERT TO MARKDOWN
        if (InputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: InputData.contentHTML,
            contentMarkdown: InputData.contentMarkdown,
            description: InputData.description,
            doctorId: InputData.doctorId,
          });
        } else if (InputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: InputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = InputData.contentHTML;
            doctorMarkdown.contentMarkdown = InputData.contentMarkdown;
            doctorMarkdown.description = InputData.description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
          }
        }

        //UPSERT TO Doctor_Info_Table
        let doctorInfo = await db.Doctor_Infor.findOne({
          where: {
            doctorId: InputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfo) {
          //UPDATE
          doctorInfo.doctorId = InputData.doctorId;
          doctorInfo.priceId = InputData.selectedPrice;
          doctorInfo.provinceId = InputData.selectedProvince;
          doctorInfo.paymentId = InputData.selectedPayment;

          doctorInfo.nameClinic = InputData.nameClinic;
          doctorInfo.addressClinic = InputData.addressClinic;
          doctorInfo.note = InputData.note;

          await doctorInfo.save();
        } else {
          //CREATE
          await db.Doctor_Infor.create({
            doctorId: InputData.doctorId,
            priceId: InputData.selectedPrice,
            provinceId: InputData.selectedProvince,
            paymentId: InputData.selectedPayment,

            nameClinic: InputData.nameClinic,
            addressClinic: InputData.addressClinic,
            note: InputData.note,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save info doctor succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        console.log("check data send", schedule);

        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formattedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        //convert date to timestamp
        // if (existing && existing.length > 0) {
        //   existing = existing.map((item) => {
        //     item.date = new Date(item.date).getTime();
        //     return item;
        //   });
        // }

        //compare different data
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //Create new data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "Create schedule succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getExtraInfoDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById=(inputId) =>{
return new Promise(async(resolve, reject)=>{
 try {
  if (!inputId) {
    resolve({
      errCode: -1,
      errMessage: "Missing required parameter!",
    });
  }else {
    let data = await db.User.findOne({
      where: {
        id: inputId,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.Markdown,
          attributes: ["contentHTML", "contentMarkdown", "description"],
        }, 
        {
          model: db.allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Doctor_Infor,
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });
    if (data && data.image) {
      data.image = new Buffer(data.image, "base64").toString("binary");
    }
    if (!data) data = {};
    resolve({
      errCode: 0,
      data: data,
    });
  }
 } catch (e) {
  reject(e);
 } 
})
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInfoDoctor: saveDetailInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
};
