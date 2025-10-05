_controller = AnimationController(
  vsync: this,
  duration: const Duration(seconds: 2),
)..repeat(reverse: true);

_rotation = Tween<double>(begin: 0.0, end: 6.28).animate(
  CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
);
