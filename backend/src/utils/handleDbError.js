export const handleDbError = (fn) => {
  return  (...args) => {
    try {
      return  fn(...args);
    } catch (err) {
      console.error('DB Error:', err.message);
      throw new Error('Database operation failed');
    }
  };
};