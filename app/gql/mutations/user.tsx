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
