import React from "react";
import styled from "styled-components";
import Button from "../Button";

const EButton = styled(Button)`
  margin-top: 15px;
`;

export default ({ isFollowing, onClick }) => (
  <EButton text={isFollowing ? "Unfollow" : "Follow"} onClick={onClick} />
);
