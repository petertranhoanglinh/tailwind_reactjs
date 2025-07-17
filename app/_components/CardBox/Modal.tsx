import { mdiClose } from "@mdi/js";
import { ReactNode } from "react";
import type { ColorButtonKey } from "../../_interfaces";
import Button from "../Button";
import Buttons from "../Buttons";
import CardBox from ".";
import CardBoxComponentTitle from "./Component/Title";
import OverlayLayer from "../OverlayLayer";

type Props = {
  title: string;
  buttonColor: ColorButtonKey;
  buttonLabel: string;
  isActive: boolean;
  children: ReactNode;
  isAction?:boolean;
  onClose: (confirmed: boolean) => void;
};

const CardBoxModal = ({
  title,
  buttonColor,
  buttonLabel,
  isActive,
  children,
  isAction = true,
  onClose,
}: Props) => {
  if (!isActive) return null;

  const handleConfirm = () => {
    onClose(true); // ✅ Confirm → true
  };

  const handleCancel = () => {
    onClose(false); // ✅ Cancel → false
  };

  const footer = isAction ? (
    <Buttons>
      <Button
        label={buttonLabel}
        color={buttonColor}
        onClick={handleConfirm}
        isGrouped
      />
      <Button
        label="Cancel"
        color={buttonColor}
        outline
        onClick={handleCancel}
        isGrouped
      />
    </Buttons>
  ) : null;

  return (
    <OverlayLayer onClick={handleCancel} className="cursor-pointer">
      <CardBox
        className={`transition-transform shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50`}
        isModal
        footer={footer}
      >
        <CardBoxComponentTitle title={title}>
          <Button
            icon={mdiClose}
            color="whiteDark"
            onClick={handleCancel}
            small
            roundedFull
          />
        </CardBoxComponentTitle>

        <div className="space-y-3">{children}</div>
      </CardBox>
    </OverlayLayer>
  );
};

export default CardBoxModal;

