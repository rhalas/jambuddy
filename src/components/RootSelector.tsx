import { notes } from "../helpers/types/music_types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { Text } from "@radix-ui/themes";
import { CaretDownIcon } from "@radix-ui/react-icons";

type rootSelectorProps = {
  currentRoot: string;
  setNewRoot: (mode: string) => void;
  editModeEnabled: boolean;
};

const DropdownRoot = styled(DropdownMenu.Root)`
  overflow: auto;
  height: 1000px;
  position: relative;
`;

const DropDownTrigger = styled(DropdownMenu.Trigger)`
  padding: 0;
  padding-left: 5px;
  position: relative;
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
  height: 300px;
  position: relative;
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
    left: 55% !important;
    transform: translateX(-50%) !important;
  }
`;

export const RootSelector = (modeSelectorProps: rootSelectorProps) => {
  const { currentRoot, setNewRoot, editModeEnabled } = modeSelectorProps;
  return editModeEnabled ? (
    <RootContainer>
      <DropdownRoot>
        <DropDownTrigger>
          {` ${currentRoot}`}
          <CaretDownIcon />
        </DropDownTrigger>
        <DropDownContent>
          {notes.map((note) => {
            return (
              <DropdownCheckboxItem
                onClick={() => {
                  setNewRoot(note);
                }}
              >
                <Text>{note}</Text>
              </DropdownCheckboxItem>
            );
          })}
        </DropDownContent>
      </DropdownRoot>
    </RootContainer>
  ) : (
    <RootContainer>{` ${currentRoot}`}</RootContainer>
  );
};
