import {
  LayoutDashboard, Send, Download, Heart, Ticket, Users,
  History as HistoryIcon, Shield, User,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "send", label: "Send", icon: Send },
  { id: "receive", label: "Receive", icon: Download },
  { id: "tip", label: "Tip Creators", icon: Heart },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "split", label: "Split Payments", icon: Users },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "security", label: "Security", icon: Shield },
  { id: "profile", label: "Profile", icon: User },
];
