import Ball from '../../Ball';
import { BallVsBall } from './@types';

export function detect(balls: Ball[]) {
  const collisions: BallVsBall[] = balls
    .flatMap((ball1, i) => balls.slice(i + 1).map((ball2) => [ball1, ball2]))
    .reduce((acc: BallVsBall[], combination) => {
      const [ball1, ball2] = combination;
      const distance = ball1.position.distanceTo(ball2.position);
      if (distance > 0 && distance < ball1.radius + ball2.radius) {
        const normal = ball1.position.clone().sub(ball2.position).normalize();
        acc = [...acc, { ball1, ball2, distance, normal }];
      }
      return acc;
    }, []);
  return collisions;
}

export function handle(collisions: BallVsBall[]) {
  collisions.forEach((collision: BallVsBall) => {
    // Correct positions
    collision.ball1.position.sub(
      collision.normal
        .clone()
        .multiplyScalar(
          ((collision.distance -
            (collision.ball1.radius + collision.ball2.radius)) *
            collision.ball1.radius) /
            (collision.ball1.radius + collision.ball2.radius)
        )
    );
    collision.ball2.position.add(
      collision.normal
        .clone()
        .multiplyScalar(
          ((collision.distance -
            (collision.ball1.radius + collision.ball2.radius)) *
            collision.ball2.radius) /
            (collision.ball1.radius + collision.ball2.radius)
        )
    );
    // Compute velocities
    // https://physics.stackexchange.com/questions/598480/calculating-new-velocities-of-n-dimensional-particles-after-collision/598524#598524
    const J =
      ((2 - 0.3) *
        collision.normal
          .clone()
          .dot(
            collision.ball1.velocity.clone().sub(collision.ball2.velocity)
          )) /
      (1 / collision.ball1.mass + 1 / collision.ball2.mass);
    collision.ball1.velocity.sub(
      collision.normal.clone().multiplyScalar(J / collision.ball1.mass)
    );
    collision.ball2.velocity.add(
      collision.normal.clone().multiplyScalar(J / collision.ball2.mass)
    );
  });
}
