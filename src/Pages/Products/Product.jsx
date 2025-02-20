import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaAnglesDown } from "react-icons/fa6";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Product() {
  const [selectedDepartment, setSelectedDepartment] = useState("Kitchen");
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inventoryData = useSelector((state) => state.product.inventoryData);

  const filteredData = inventoryData.filter((item) => {
    if (checked) {
      return item.department === selectedDepartment && item.stock < 10;
    } else {
      return item.department === selectedDepartment && item.stock > 0;
    }
  });

  const navigateToProduct = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <>
      <div className="w-full h-full mx-auto px-5 mt-5 flex flex-col gap-4 overflow-x-auto">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex justify-between gap-10 items-center">
            <h2 className="text-lg font-semibold">Products</h2>
            <div className="flex justify-center gap-1 items-center">
              <input
                type="checkbox"
                id="myCheckbox"
                name="myCheckbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <label htmlFor="myCheckbox" className="text-md">
                Low stock item
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-2 items-center">
            <select
              className="border p-2 rounded-lg"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option value="Kitchen">Kitchen</option>
              <option value="Toys">Toys</option>
              <option value="Clothing">Clothing</option>
            </select>

            <div>
              <button
                type="button"
                class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={handleOpen}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Product Image
                </th>
                <th
                  scope="col"
                  className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Stocks
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                >
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {inventoryData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-10 text-sm font-semibold"
                  >
                    No matching data available
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item?.name}
                    className="cursor-pointer"
                    onClick={() => navigateToProduct(item.id)}
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-40 w-40 flex-shrink-0">
                          <img
                            className="h-40 w-40 object-cover"
                            src={item?.imageUrl}
                            alt={item?.name}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-12 py-4">
                      <div className="text-sm text-gray-900 ">{item.name}</div>
                    </td>
                    <td className="whitespace-wrap ">
                      <div className="text-sm text-gray-900 ">
                        {item?.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-12 py-4">
                      <div className="text-sm text-gray-900 ">
                        {item?.price}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-12 py-4">
                      <div
                        className={`text-sm text-gray-700 font-semibold font  `}
                      >
                        {item?.stock}{" "}
                        <span>
                          {item?.stock < 10 ? (
                            <FaAnglesDown size={22} color="red" />
                          ) : (
                            ""
                          )}
                        </span>{" "}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                      <a href="#" className="text-gray-700">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <BasicModal open={open} handleClose={handleClose} />
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

function BasicModal({ open, handleClose }) {
  const initialValues = {
    department: "",
    productName: "",
    description: "",
    price: 0,
    stockAvailable: 0,
    supplierName: "",
    imageUrl: "",
  };

  const validationSchema = Yup.object().shape({
    department: Yup.string().required("Department is required"),
    productName: Yup.string().required("Product Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .min(500, "Price must be greater than 499/-")
      .required("Price is required"),
    stockAvailable: Yup.number()
      .min(4, "Stock Available must be greater than 4")
      .required("Stock Available is required"),
    supplierName: Yup.string().required("Supplier Name is required"),
    imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
  });

  const handleSubmit = (values) => {
    // Handle form submission here
    console.log(values);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-center text-xs font-semibold ">Add Details</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="grid grid-cols-12 gap-2">
                <div className="col-span-12 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="department">
                    Department
                  </label>
                  <Field
                    as="select"
                    id="department"
                    name="department"
                    className="px-2 py-1 border"
                  >
                    <option value="">Select Department</option>
                    <option value="Toys">Toys</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Clothing">Clothing</option>
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="productName">
                    Product Name
                  </label>
                  <Field
                    type="text"
                    id="productName"
                    name="productName"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="productName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="price">
                    Price
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="stockAvailable">
                    Stock Available
                  </label>
                  <Field
                    type="number"
                    id="stockAvailable"
                    name="stockAvailable"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="stockAvailable"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="supplierName">
                    Supplier Name
                  </label>
                  <Field
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="supplierName"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="description">
                    Description
                  </label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div className="col-span-6 flex flex-col gap-2">
                  <label className="text-xs" htmlFor="imageUrl">
                    Image URL
                  </label>
                  <Field
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    className="px-2 py-1 border"
                  />
                  <ErrorMessage
                    name="imageUrl"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-12 w-full text-center bg-[#222]  py-1 rounded-lg text-white text-sm "
                >
                  Create New Product
                </button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
}
