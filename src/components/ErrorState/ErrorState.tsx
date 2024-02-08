interface ErrorStateProps {
  errorMessage: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  return <div>{errorMessage}</div>;
};
