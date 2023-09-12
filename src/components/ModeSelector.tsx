import { modes } from "../helpers/types/music_types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { Text } from "@radix-ui/themes";
import { CaretDownIcon } from "@radix-ui/react-icons";

type modeSelectorProps = {
  currentMode: string;
  setNewMode: (mode: string) => void;
  editModeEnabled: boolean;
};

const DropDownTrigger = styled(DropdownMenu.Trigger)`
  padding: 0;
  padding-left: 5px;
`;

const DropDownContent = styled(DropdownMenu.Content)`
  min-width: 50px;
  background-color: white;
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
`;

const DropdownCheckboxItem = styled(DropdownMenu.CheckboxItem)`
  cursor: pointer;
  &:hover {
    background-color: lightblue;
  }
`;

const RootContainer = styled.span`
  div[data-radix-popper-content-wrapper] {
    position: absolute !important;
    left: 73% !important;
    transform: translateX(-50%) !important;
  }
`;

export const ModeSelector = (modeSelectorProps: modeSelectorProps) => {
  const { currentMode, setNewMode, editModeEnabled } = modeSelectorProps;
  return editModeEnabled ? (
    <RootContainer>
      <DropdownMenu.Root>
        <DropDownTrigger>
          {` ${currentMode}`}
          <CaretDownIcon />
        </DropDownTrigger>
        <DropDownContent>
          {modes.map((mode) => {
            return (
              <DropdownCheckboxItem
                onClick={() => {
                  setNewMode(mode);
                }}
              >
                <Text>{mode}</Text>
              </DropdownCheckboxItem>
            );
          })}
        </DropDownContent>
      </DropdownMenu.Root>
    </RootContainer>
  ) : (
    <RootContainer>{` ${currentMode}`}</RootContainer>
  );
};
