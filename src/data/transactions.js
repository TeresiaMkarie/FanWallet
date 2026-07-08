import { ArrowUpRight, ArrowDownLeft, Ticket, Heart, Users, Trophy } from "lucide-react";

export const TX_META = {
  send: { icon: ArrowUpRight, label: "Sent", color: "var(--red-card)" },
  receive: { icon: ArrowDownLeft, label: "Received", color: "var(--pitch-accent)" },
  ticket: { icon: Ticket, label: "Ticket purchase", color: "var(--kit-gold)" },
  tip: { icon: Heart, label: "Creator tip", color: "var(--kit-gold)" },
  split: { icon: Users, label: "Split payment", color: "var(--red-card)" },
  reward: { icon: Trophy, label: "Reward received", color: "var(--pitch-accent)" },
};
