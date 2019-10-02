import React from 'react';

interface Props {
  startStep: number;
  externalOverrides: Partial<State>;
}

export interface State {
  currentStep: number;
  totalSteps: number;
  previous: Wizard['previous'];
  next: Wizard['next'];
  jump: Wizard['jump'];
}

export const WizardContext = React.createContext<
  State & { init: Wizard['init'] }
>({
  currentStep: 1,
  totalSteps: 1,
  previous() {},
  next() {},
  jump() {},
  init() {}
});

export default class Wizard extends React.Component<Props, State> {
  static defaultProps = {
    startStep: 1,
    externalOverrides: {}
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      currentStep: props.externalOverrides.currentStep || state.currentStep
    };
  }

  previous = (...args: any[]) => {
    if (this.state.currentStep > 1) {
      if (this.props.externalOverrides.previous) {
        this.props.externalOverrides.previous(...args);
      } else {
        this.setState(({ currentStep }) => ({ currentStep: currentStep - 1 }));
      }
    }
  };

  next = (...args: any[]) => {
    if (this.state.currentStep < this.state.totalSteps) {
      if (this.props.externalOverrides.next) {
        this.props.externalOverrides.next(...args);
      } else {
        this.setState(({ currentStep }) => ({ currentStep: currentStep + 1 }));
      }
    }
  };

  jump = (position: number) => {
    if (position <= this.state.totalSteps) {
      if (this.props.externalOverrides.jump) {
        this.props.externalOverrides.jump(position);
      } else {
        this.setState({ currentStep: position });
      }
    }
  };

  init = (steps: number) => {
    this.setState({ totalSteps: steps });
  };

  state = {
    currentStep:
      this.props.externalOverrides.currentStep || this.props.startStep,
    totalSteps: 1,
    init: this.init,
    previous: this.previous,
    next: this.next,
    jump: this.jump
  };

  render() {
    return (
      <WizardContext.Provider value={this.state}>
        {this.props.children}
      </WizardContext.Provider>
    );
  }
}