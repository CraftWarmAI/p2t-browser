import * as React from "react";
import { Options } from "../component";
import renderer from "react-test-renderer";

it("component renders", () => {
    const tree = renderer.create(<Options />).toJSON();
    expect(tree).toMatchSnapshot();
});
