import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface PasswordResetEmailProps {
  userEmail: string;
  resetUrl: string;
  userName: string;
}

const PasswordResetEmail = ({
  userEmail,
  resetUrl,
  userName,
}: PasswordResetEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Reset your password - Action required</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password for your
                JustProImages.com account.
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Hi {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Someone requested a password reset for your JustProImages.com
                account associated with {userEmail}.
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                If this was you, click the button below to reset your password.
                If you didn't request this, you can safely ignore this email.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={resetUrl}
                className="bg-red-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                If the button above doesn't work, copy and paste this link into
                your browser:
              </Text>
              <Link
                href={resetUrl}
                className="text-red-600 text-[14px] break-all"
              >
                {resetUrl}
              </Link>
            </Section>

            {/* Security Warning */}
            <Section className="bg-red-50 border-l-[4px] border-red-400 p-[20px] mb-[32px]">
              <Text className="text-[14px] text-red-800 mb-[8px] m-0">
                <strong>Important Security Information:</strong>
              </Text>
              <Text className="text-[14px] text-red-700 mb-[8px] m-0">
                • This password reset link will expire in 1 hour for security
                reasons
              </Text>
              <Text className="text-[14px] text-red-700 mb-[8px] m-0">
                • If you didn't request this reset, please contact our support
                team immediately
              </Text>
              <Text className="text-[14px] text-red-700 m-0">
                • Never share this link with anyone else
              </Text>
            </Section>

            {/* Additional Help */}
            <Section className="bg-gray-50 p-[20px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 mb-[8px] m-0">
                <strong>Need Help?</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                If you're having trouble resetting your password or didn't
                request this change, please contact our support team.
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                <Link href="#" className="text-blue-600 no-underline">
                  Contact Support
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                © 2025 JustProImages.com - All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                123 Business Street, Suite 100, Bengaluru, KA 560001, India
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                <Link href="#" className="text-gray-500 no-underline">
                  Unsubscribe
                </Link>
                {" | "}
                <Link href="#" className="text-gray-500 no-underline">
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
