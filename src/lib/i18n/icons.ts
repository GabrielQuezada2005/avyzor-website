import {
  Globe,
  Bot,
  Zap,
  Calendar,
  Link as LinkIcon,
  Search,
  Shield,
  Award,
  Brain,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  Globe,
  Bot,
  Zap,
  Calendar,
  Link: LinkIcon,
  Search,
  Shield,
  Award,
  Brain,
  TrendingUp,
  Users,
};

export function getLucideIcon(name: string): LucideIcon | undefined {
  return LUCIDE_ICONS[name];
}
