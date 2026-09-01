import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  /** Verify the admin password against ADMIN_PASSWORD_HASH (bcrypt, preferred)
   *  or ADMIN_PASSWORD (plaintext fallback), and return a signed JWT. */
  async login(password: string): Promise<string> {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    const plain = process.env.ADMIN_PASSWORD;

    let ok = false;
    if (hash) {
      ok = await bcrypt.compare(password, hash);
    } else if (plain) {
      ok = safeEqual(password, plain);
    } else {
      throw new UnauthorizedException(
        'Admin password is not configured (set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD).',
      );
    }

    if (!ok) throw new UnauthorizedException('Invalid password');
    return this.jwt.signAsync({ sub: 'admin', role: 'admin' });
  }
}

/** Constant-time string comparison (avoids leaking length-independent timing). */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
