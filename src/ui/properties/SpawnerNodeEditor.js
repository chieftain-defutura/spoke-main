import React, { Component,} from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import ModelInput from "../inputs/ModelInput";
import BooleanInput from "../inputs/BooleanInput";
import { Magic } from "styled-icons/fa-solid/Magic";
import { GLTFInfo } from "../inputs/GLTFInfo";
import AttributionNodeEditor from "./AttributionNodeEditor";


export default class SpawnerNodeEditor extends Component {
 
  
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = Magic;

  static description = "Spawns a model as an interactable object.";

  onChangeSrc = (src, initialProps) => {
    this.props.editor.setPropertiesSelected({ ...initialProps, src });
  };

  onChangeApplyGravity = applyGravity => {
    this.props.editor.setPropertySelected("applyGravity", applyGravity);
  };

  render() {
    const node = this.props.node;
    const[open,setOpen]= useState(false);
    
    useEffect(() => {
      setOpen(open => !open)
    }, [setOpen])
    

    return (
      <NodeEditor {...this.props} description={SpawnerNodeEditor.description}>
        <InputGroup name="Model Url">
          <ModelInput value={node.src} onChange={this.onChangeSrc} />
        </InputGroup>
        <InputGroup name="Apply gravity to spawned object">
          <BooleanInput value={node.applyGravity} onChange={this.onChangeApplyGravity} />
        </InputGroup>
        <div style={{background:"red"}}>
        {node.model && <GLTFInfo onClick={setOpen} node={node} />}
        <AttributionNodeEditor name="Attribution" onClick={setOpen} {...this.props} />
        </div>
      </NodeEditor>
    );
  }
}
