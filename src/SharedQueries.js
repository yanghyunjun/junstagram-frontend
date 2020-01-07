import { gql } from "apollo-boost";

export const MyProfile = gql`
  {
    myProfile {
      username
    }
  }
`;
