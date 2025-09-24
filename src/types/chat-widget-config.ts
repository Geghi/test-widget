export interface MessagesConfig {
  initial: string;
  placeholder: string;
  error: string;
  thinking: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
}

export interface ColorsConfig {
  primary: string;
  secondary: string;
  text: string;
  textLight: string;
  background: string;
  userMessage: string;
  botMessage: string;
  shadow: string;
}

export interface DimensionsConfig {
  windowWidth: number;
  windowHeight: number;
  mobileBreakpoint: number;
}

export interface ChatWidgetConfig {
  position: string;
  colors: ColorsConfig;
  animation: AnimationConfig;
  messages: MessagesConfig;
  dimensions: DimensionsConfig;
}
