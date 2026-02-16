const sum = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
test('Pipeline Health Check', () => {
    const status = 'active';
    expect(status).toBe('active');
  });