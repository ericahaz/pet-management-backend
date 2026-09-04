const TEMPERAMENT_PRIORITY = {
  red: 'high',
  yellow: 'medium',
  green: 'low'
};

function derivePriority(temperamentObserved) {
  return TEMPERAMENT_PRIORITY[temperamentObserved] || 'low';
}

// Used for sorting queues: lower number = more urgent
const PRIORITY_RANK = { high: 1, medium: 2, low: 3 };

module.exports = { derivePriority, PRIORITY_RANK };
