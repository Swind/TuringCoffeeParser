import * as React from "react";
import * as ReactDOM from "react-dom";

import { Cookbook, Process } from "../Api/cookbook";

const Anchor = require("grommet/components/Anchor");
const Box = require("grommet/components/Box");
const Card = require("grommet/components/Card");
const Columns = require("grommet/components/Columns");
const Label = require("grommet/components/Label");
const Value = require("grommet/components/Value");

const EditIcon = require("grommet/components/icons/base/Edit");

interface CookbookCardProps {
  key: string;
  cookbook: Cookbook;
}

interface CookbookLinkProps {
  onEdit(id: string): void;
  onBrew(id: string): void;
}

function CookbookLink({ onEdit, onBrew }: CookbookLinkProps) {
  return (
    <Box direction="row">
      <Anchor icon={<EditIcon />} label="Edit" onClick={onEdit} />
      <Anchor icon={<EditIcon />} label="Brew" onClick={onBrew} />
    </Box>
  );
}

interface CookbookDescriptionProps {
  cookbook: Cookbook;
}

function CookbookDescription(props: CookbookDescriptionProps) {
  const { cookbook } = props;
  return (
    <Box pad="small">
      <Label size="small">Water {cookbook.totalWater } ml</Label>
      <Label size="small">Time {cookbook.totalTime } s</Label>
    </Box>
  );
}

export default function CookbookCard(
  props: CookbookCardProps & CookbookLinkProps
) {
  const { cookbook, onBrew, onEdit } = props;

  return (
    <div>
      <Box
        margin="small"
        pad="small"
        colorIndex="light-2"
        size={{ width: "full" }}
      >
        <div>
          <Box pad="small" colorIndex="light-1">
            <h3>{cookbook.name}</h3>
            <CookbookDescription cookbook={cookbook} />
            <CookbookLink onBrew={onBrew} onEdit={onEdit} />
          </Box>
        </div>
      </Box>
    </div>
  );
}
