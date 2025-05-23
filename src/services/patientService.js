import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing require parameter!",
        });
      } else {
        await emailService.sendEmail({
          receiverEmail: data.email,
          subject: "Booking appointment",
          patientName: data.patientName,
          time: data.time,
          doctorName: data.doctorName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          date: data.date,
          redirectLink: `https://www.instagram.com/ahryxx._/`,
        });
        //Upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });
        //Create a booking record
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save info succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
};
