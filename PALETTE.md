CODES USE FOR REFERENCE

*---Simple Banner with CTA Button---


[import React from "react";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function BannerSection6() {
  return (
    <section className="py-20 container mx-auto">
      <div className="mb-4 shadow-sm px-4 py-2 flex flex-wrap lg:items-center lg:justify-center justify-end gap-x-6">
        <Typography variant="h6" color="blue-gray" className="text-md">
          NEW | Material Tailwind PRO, a comprehensive compilation of 200+
          sections, now available for your use!
        </Typography>
        <Button size="sm" variant="outlined">
          check out
        </Button>
        <IconButton variant="text">
          <XMarkIcon className="text-gray-900 w-4 h-4 stroke-2" />
        </IconButton>
      </div>
      <div className="mb-4 shadow-sm px-4 py-2 flex bg-gray-900 flex-wrap lg:items-center lg:justify-center justify-end gap-x-6">
        <Typography variant="h6" color="white" className="text-md">
          NEW | Material Tailwind PRO, a comprehensive compilation of 200+
          sections, now available for your use!
        </Typography>
        <Button color="white" size="sm">
          check out
        </Button>
        <IconButton color="white" variant="text">
          <XMarkIcon className="text-white w-4 h-4 stroke-2" />
        </IconButton>
      </div>
    </section>
  );
}

export default BannerSection6;
]


*--Order Section--


[import React from "react";
import {
  Step,
  Card,
  Button,
  Stepper,
  CardBody,
  CardHeader,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export function OrderTracking1() {
  const [activeStep, setActiveStep] = React.useState(0);

  const PRODUCTS = [
    {
      img: "https://www.material-tailwind.com/image/product-2.png",
      title: "Premium Suit",
      details: "Premium Wool Blend (80% Wool, 20% Polyester)",
      size: "Size: M",
      price: "Price: $790.00",
    },
    {
      img: "https://www.material-tailwind.com/image/product-2.png",
      title: "Classic Leather Jacket",
      details: "Premium Leather (100% Genuine Leather)",
      size: "Size: M",
      price: "Price: $990.00",
    },
  ];

  const BILLING = [
    {
      value: "Subtotal",
      price: "$1,780.00",
    },
    {
      value: "Shipping estimate",
      price: "$0",
    },
    {
      value: "Tax estimate",
      price: "$5",
    },
  ];

  return (
    <section className="container mx-auto py-20 px-8">
      <Typography variant="h4">Order Details</Typography>
      <Typography className="text-gray-600 font-normal">
        Order placed on <span className="font-bold">April 1, 2023</span>
      </Typography>
      <div className="mt-8 grid lg:gap-x-6 gap-y-6 lg:grid-cols-12 grid-cols-6">
        <div className="col-span-8 space-y-6">
          <Card className="border border-gray-300 !rounded-md shadow-sm">
            <CardBody className="p-4 flex gap-4 flex-col md:flex-row items-center justify-between">
              <div className="flex !justify-between w-full">
                <div>
                  <Typography color="blue-gray" className="!font-semibold">
                    Date Ordered
                  </Typography>
                  <Typography className="text-gray-600 font-normal">
                    April 1, 2023
                  </Typography>
                </div>
                <div>
                  <Typography color="blue-gray" className="!font-semibold">
                    Order Number
                  </Typography>
                  <Typography className="text-gray-600 font-normal">
                    #123456789
                  </Typography>
                </div>
              </div>
              <div className="w-full">
                <Button
                  variant="outlined"
                  className="ml-auto border-gray-200 flex items-center justify-center gap-2 w-full md:max-w-fit"
                >
                  Download invoice
                  <ArrowDownTrayIcon
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                </Button>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-300 !rounded-md shadow-sm">
            <CardHeader
              shadow={false}
              className="md:h-40 h-32 rounded-none border-b border-gray-300"
            >
              <Stepper
                activeStep={activeStep}
                lineClassName="bg-gray-300"
                activeLineClassName="bg-gray-900"
              >
                <Step
                  className="fas fa-check-circle !rounded-md !bg-gray-900 !text-white"
                  activeClassName="bg-blue-gray-500 text-white"
                  completedClassName="!blue-900 text-white"
                  onClick={() => setActiveStep(0)}
                >
                  <div className="absolute md:pl-32 pl-6 md:-bottom-[4.5rem] -bottom-[3rem] w-max text-left">
                    <Typography variant="h6" color="blue-gray">
                      Account
                    </Typography>
                    <Typography className="font-normal text-gray-600 md:block hidden">
                      10:00 PM April 1, 2024
                    </Typography>
                  </div>
                </Step>
                <Step
                  className="fas fa-truck !rounded-md !border border-gray-300 text-gray-900 !bg-white"
                  activeClassName="!bg-gray-900 !text-white"
                  completedClassName="!bg-gray-900 !text-white"
                  onClick={() => setActiveStep(1)}
                >
                  <div className="absolute  md:-bottom-[4.5rem] -bottom-[3rem] w-max text-center">
                    <Typography variant="h6" color="blue-gray">
                      Delivered to the Courier
                    </Typography>
                    <Typography className="font-normal text-gray-600 md:block hidden">
                      10:00 PM April 3, 2024
                    </Typography>
                  </div>
                </Step>
                <Step
                  className="fas fa-gift !rounded-md !border border-gray-300 text-gray-900 !bg-white"
                  activeClassName="!bg-gray-900 text-white"
                  completedClassName="!bg-gray-900 text-white"
                  onClick={() => setActiveStep(2)}
                >
                  <div className="absolute md:-bottom-[4.5rem] -bottom-[3rem] w-max text-right md:pr-44 pr-5">
                    <Typography variant="h6" color="blue-gray">
                      Delivery
                    </Typography>
                    <Typography className="font-normal text-gray-600 md:block hidden">
                      Estimated date: April 9, 2024
                    </Typography>
                  </div>
                </Step>
              </Stepper>
            </CardHeader>
            <CardBody className="md:px-2 pb-14">
              {PRODUCTS.map(({ img, title, details, size, price }) => (
                <div
                  key={title}
                  className="space-y-10 flex flex-wrap justify-center md:justify-start items-start"
                >
                  <img src={img} className="h-[140px]" alt={title} />
                  <div className="-translate-y-6 space-y-1 md:text-start text-center">
                    <Typography variant="h6" color="blue-gray">
                      {title}
                    </Typography>
                    <Typography className="font-normal text-gray-600">
                      {details}
                    </Typography>
                    <Typography className="font-normal text-gray-600">
                      {size}
                    </Typography>
                    <Typography className="font-normal text-gray-600">
                      {price}
                    </Typography>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full space-y-6">
          <Card className="border border-gray-300 !rounded-md shadow-sm">
            <CardBody className="p-4">
              <Typography color="blue-gray" className="!font-semibold">
                Date Ordered
              </Typography>
              {BILLING.map(({ value, price }) => (
                <div key={value} className="my-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography className="text-gray-600 font-normal">
                      {value}
                    </Typography>
                    <Typography className="text-gray-600 font-normal">
                      {price}
                    </Typography>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-gray-300 pt-4">
                <Typography color="blue-gray" className="!font-semibold">
                  Order Total
                </Typography>
                <Typography color="blue-gray" className="!font-semibold">
                  $1,785.00
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-300 !rounded-md shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <Typography color="blue-gray" className="!font-semibold">
                  Shipping Address
                </Typography>
                <IconButton
                  size="sm"
                  variant="outlined"
                  className="border-gray-300 !rounded-md"
                >
                  <PencilIcon className="h-3.5 w-3.5 text-gray-900" />
                </IconButton>
              </div>
              <div className="space-y-2 mt-4">
                <Typography className="text-gray-600 font-normal">
                  John Doe
                </Typography>
                <Typography className="text-gray-600 font-normal">
                  1234 Elm Street
                </Typography>
                <Typography className="text-gray-600 font-normal">
                  Suite 567
                </Typography>
                <Typography className="text-gray-600 font-normal">
                  Los Angeles, CA 90001
                </Typography>
                <Typography className="text-gray-600 font-normal">
                  United States
                </Typography>
                <Typography className="text-gray-600 font-normal">
                  +1 (555) 123-4567
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-300 !rounded-md shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <Typography color="blue-gray" className="!font-semibold">
                  Billing
                </Typography>
                <IconButton
                  size="sm"
                  variant="outlined"
                  className="border-gray-300 !rounded-md"
                >
                  <PencilIcon className="h-3.5 w-3.5 text-gray-900" />
                </IconButton>
              </div>
              <Typography className="mt-4 text-gray-600 font-normal">
                Same as shipping address
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default OrderTracking1;
]