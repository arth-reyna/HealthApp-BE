import { badRequest, notFound } from "../../utils/responseHandler.js";
import { rolesRequired } from "./user.roles.js";

export const userValidation = async (data, role, res) => {
  try {
    const requiredFields = rolesRequired[role];

    if (!requiredFields || requiredFields === undefined)
      throw badRequest(res, "required fields not found");

    console.log(res, "Required Field: ", requiredFields);

    //Check if role present in roles
    if (!role in rolesRequired) {
      throw badRequest(res, `${role} Role not found`);
    }

    //Iterate over each field to validate
    requiredFields.forEach((field) => {
      console.log("Fields inside required field: ", field);
      
      //Check if any field is empty or not
      if (data[field] == null || !data[field]) {
        console.log("Data not present for: ", data[field]);
        throw notFound(res, "not all fields present");
      }
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserValidation = async (res, role) => {
  try {
    if (!rolesRequired.hasOwnProperty(role)) {
      throw notFound(res, `${role} not found.`);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
