import { gql } from '@/gql/generated';

export const SignupMutation = gql(/* GraphQL */ `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
    }
  }
`);

export const LoginMutation = gql(/* GraphQL */ `
  mutation LoginTest($input: LoginInput!) {
    login(input: $input) {
      id
    }
  }
`);

export const LogoutMutation = gql(/* GraphQL */ `
  mutation Logout {
    logout {
      id
    }
  }
`);

export const UpdateEmailMutation = gql(/* GraphQL */ `
  mutation UpdateEmail($email: Email!) {
    updateEmail(email: $email) {
      email
    }
  }
`);

export const UpdateDetailsMutation = gql(/* GraphQL */ `
  mutation UpdateDetails($input: UpdateDetailsInput!) {
    updateDetails(input: $input) {
      customer {
        firstName
        lastName
        title
      }
    }
  }
`);
