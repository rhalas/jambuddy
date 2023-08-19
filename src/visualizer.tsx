import Sketch from "react-p5";
import p5Types from "p5";
import * as Tone from "tone";
import styled from "styled-components";

type VisualizerProps = {
  meter: Tone.Meter;
  fft: Tone.FFT;
};

const VisualizerContainer = styled.div`
  display: flex;
`;

const width = 1000;
const height = 60;

export const Visualizer = (props: VisualizerProps) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    const { fft } = props;
    if (!fft) {
      return;
    }

    const levels = fft.getValue();
    p5.clear();
    for (let i = 0; i < levels.length; i++) {
      p5.push();
      p5.strokeWeight(1);
      const binMapped = p5.map(levels[i], -100, 12, height, 0);
      p5.stroke(binMapped, binMapped, binMapped);
      p5.line(i * 25, height, i * 25, binMapped);
      p5.pop();

      p5.push();
      p5.stroke(255, 229, 0);
      p5.strokeWeight(5);
      p5.line(i * 25 - 3, binMapped, i * 25 + 3, binMapped);
      p5.pop();
    }
  };

  return (
    <VisualizerContainer>
      <Sketch setup={setup} draw={draw} />
    </VisualizerContainer>
  );
};
