import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import useInput from "../Hooks/useInput";
import Input from "./Input";
import { InstaLogo, Compass, HeartEmpty, PersonLogo } from "./Icons";
import { useQuery } from "react-apollo-hooks";

const Header = styled.header`
  width: 100%;
  ${props => props.theme.whiteBox}
  border-bottom:${props => props.theme.boxBorder}
  border:0;
  background-color:white;
  border-radius: 0px;
  margin-bottom: 60px;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:25px 0px;
`;

const HeaderWrapper = styled.div`
    width:100%
    max-width:${props => props.theme.maxWidth}
    display:flex;
    justify-content:center;
`;

const HeaderColumn = styled.div`
  width: 33%;
  text-align: center;
  &:first-child {
    margin-right: auto;
    text-align: left;
  }
  &:last-child {
    margin-left: auto;
    text-align: right;
  }
`;

const SearchInput = styled(Input)`
  background-color: ${props => props.theme.bgColor};
  padding: 5px;
  font-size: 14px;
  border-radius: 3px;
  height: auto;
  text-align: center;
  width: 80%;
  &::placeholder {
    opacity: 0.8;
    font-weight: 400;
  }
`;

const HeaderLink = styled(Link)`
  &:not(:last-child) {
    margin-right: 30px;
  }
`;

const MyProfile = gql`
  {
    myProfile {
      username
    }
  }
`;

export default withRouter(({ history }) => {
  const search = useInput("");
  const { data } = useQuery(MyProfile);
  console.log(data && data.myProfile);
  const onSearchSubmit = e => {
    e.preventDefault();
    history.push(`/search?term=${search.value}`);
  };
  return (
    <Header>
      <HeaderWrapper>
        <HeaderColumn>
          <Link to="/">
            <InstaLogo />
          </Link>
        </HeaderColumn>
        <HeaderColumn>
          <form onSubmit={onSearchSubmit}>
            <SearchInput {...search} placeholder="search" />
          </form>
        </HeaderColumn>
        <HeaderColumn>
          <HeaderLink to="/notifications">
            <HeartEmpty />
          </HeaderLink>
          <HeaderLink to="/explore">
            <Compass />
          </HeaderLink>
          {!(data && data.myProfile) ? (
            <HeaderLink to="/#">
              <PersonLogo />
            </HeaderLink>
          ) : (
            <HeaderLink to={data.myProfile.username}>
              <PersonLogo />
            </HeaderLink>
          )}
        </HeaderColumn>
      </HeaderWrapper>
    </Header>
  );
});
