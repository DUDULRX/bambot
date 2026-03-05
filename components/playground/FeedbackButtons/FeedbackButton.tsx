import GlassButton from "./GlassButton";
import { RiKeyboardFill } from "@remixicon/react";

interface FeedbackButtonProps {
  showFeedbackPanel: boolean;
  onToggleFeedbackPanel: () => void;
}

export default function FeedbackButton({
  showFeedbackPanel,
  onToggleFeedbackPanel,
}: FeedbackButtonProps) {
  return (
    <GlassButton
      onClick={onToggleFeedbackPanel}
      icon={<RiKeyboardFill size={24} />}
      tooltip="Keyboard Control"
      pressed={showFeedbackPanel}
    />
  );
}
