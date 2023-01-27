const ClearButton = (props) => {
  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => props.onClick()}
    >
      Clear
    </button>
  );
};

const SaveButton = () => {
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="submit"
    >
      Save
    </button>
  );
};

const SaveEditButton = (props) => {
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => props.onClick()}
    >
      Save
    </button>
  );
};

const GetButton = () => {
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="submit"
    >
      Get
    </button>
  );
};

const RenderButton = (props) => {
  const { type, onClick } = props;
  switch (type) {
    case 'clear':
      return <ClearButton onClick={onClick} />;
    case 'save':
      return <SaveButton />;
    case 'saveEdit':
      return <SaveEditButton onClick={onClick} />;
    case 'get':
      return <GetButton />;
    default:
      return <SaveButton />;
  }
};

export default RenderButton;
