import * as React from "react";
import { Options } from "../component";
import { ComponentMeta } from "@storybook/react";

// // // //

export default {
    title: "Components/Options",
    component: Options,
} as ComponentMeta<typeof Options>;

export const Render = () => <Options />;
