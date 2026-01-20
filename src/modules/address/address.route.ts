import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { addressController } from "./address.controller";
import { addressValidation } from "./address.validation";

const addressRouter = Router();

// Create address
addressRouter.post(
    "/",
    auth(),
    validateRequest(addressValidation.createAddressZodSchema),
    addressController.createAddress
);

// Get all addresses
addressRouter.get("/", auth(), addressController.getAddresses);

// Get specific address
addressRouter.get("/:addressId", auth(), addressController.getAddress);

// Update address
addressRouter.patch(
    "/:addressId",
    auth(),
    validateRequest(addressValidation.updateAddressZodSchema),
    addressController.updateAddress
);

// Set default address
addressRouter.patch("/:addressId/set-default", auth(), addressController.setDefaultAddress);

// Delete address
addressRouter.delete("/:addressId", auth(), addressController.deleteAddress);

export default addressRouter;
