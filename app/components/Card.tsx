import {
  Card as ChakraCard,
  CardHeader as ChakraCardHeader,
  CardBody as ChakraCardBody,
  CardFooter as ChakraCardFooter,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardProps,
  HeadingProps,
  Heading,
} from "@chakra-ui/react";

type PanelCardProps = CardProps;

export default function Card({ children, ...props }: PanelCardProps) {
  return (
    <ChakraCard
      {...props}
      bgColor="#15171C"
      color="#F5F5F5"
      borderRadius="xl"
      backgroundClip="border-box"
      border="solid 1px #1E2027"
    >
      {children}
    </ChakraCard>
  );
}

function CardHeader({ children, ...props }: CardHeaderProps) {
  return (
    <ChakraCardHeader pb="0" {...props}>
      {children}
    </ChakraCardHeader>
  );
}

function CardHeaderTitle({ children, ...props }: HeadingProps) {
  return (
    <Heading as="h2" size="md" {...props}>
      {children}
    </Heading>
  );
}

function CardHeaderSubTitle({ children, ...props }: HeadingProps) {
  return (
    <Heading
      as="h3"
      size="sm"
      color="#636674"
      fontWeight="500"
      mt={1}
      {...props}
    >
      {children}
    </Heading>
  );
}

function CardBody({ children, ...props }: CardBodyProps) {
  return <ChakraCardBody {...props}>{children}</ChakraCardBody>;
}

function CardFooter({ children, ...props }: CardFooterProps) {
  return (
    <ChakraCardFooter borderTop="solid 1px #1E2027" {...props}>
      {children}
    </ChakraCardFooter>
  );
}

Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Body = CardBody;

CardHeader.Title = CardHeaderTitle;
CardHeader.SubTitle = CardHeaderSubTitle;
