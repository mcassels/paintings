import { Button } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";

export default function BrowsePaintingsButton() {
  return (
    <Button type="primary" ghost>
      <NavLink to="/gallery">
        Browse paintings
      </NavLink>
    </Button>
  )
}