import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com",
    discord: "https://discord.com",
    homepage: "/",
  },

  defaultCollection: {
    name: "Global Payment Collection",
    description:
      "A secure payment system allowing users to make transactions and manage refunds on the Aptos blockchain.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Payment Platform on Aptos",
    description:
      "Our platform allows users to make secure payments, view their transaction history, and receive refunds when necessary. With a transparent and decentralized structure, we ensure safe and seamless payments on the Aptos blockchain.",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com",
        },
      },
      {
        name: "Jordan",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Taylor",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "What is the Global Payment System?",
        description:
          "The Global Payment System is a decentralized application that allows users to make and receive payments securely using the Aptos blockchain. It provides functionalities for making payments, viewing payment history, and processing refunds.",
      },
      {
        title: "How do I make a payment?",
        description: `To make a payment, follow these steps:
        1. Navigate to the "Make Payment" section in the app.
        2. Enter the payee's address and the amount you wish to send.
        3. Click on the "Make Payment" button.
        4. Confirm the transaction in your connected wallet.`,
      },
      {
        title: "Is there a limit on the payment amount?",
        description:
          "There is no fixed limit for payments in the Global Payment System. However, ensure that you have sufficient balance in your wallet to cover the amount you wish to send, including any transaction fees.",
      },
      {
        title: "How can I view my payment history?",
        description: `You can view your payment history by navigating to the "Payments History" section of the app. This section will display all your past payments, including details such as payment ID, payer, payee, amount, and timestamp.`,
      },
      {
        title: "What should I do if I cannot see my payment?",
        description: `If you cannot see your payment in the history, consider the following:
        1. Ensure that the transaction was successfully processed.
        2. Refresh the payment history by clicking the "Refresh Payments" button.
        3. Check your wallet for transaction confirmation.`,
      },
      {
        title: "What should I do if I encounter an error during a transaction?",
        description: `If you encounter an error while making a payment or processing a refund, try the following:
        1. Check your internet connection.
        2. Ensure that your wallet is connected and has sufficient funds.
        3. Refresh the app and try again.
        4. If the problem persists, contact our support team for assistance.`,
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
