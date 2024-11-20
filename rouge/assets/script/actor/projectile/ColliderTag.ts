import { Collider, DeferredPipeline, ccenum } from "cc";

export namespace colliderTag {
    export enum Define {
        Scene = 0,
        Player = 101,
        Enemy = 102,
        AlertRange = 103,
        PlayerProjectile = 104,
        EnemyProjectile = 105,
        magnet=106,
        dropItem=107,
    }
    ccenum(Define);

    export function isScene(tag: number) {
        return tag == Define.Scene;
    }

    export function isProjectileHitable(tag: number, other: number): boolean {
        
        if (tag == Define.PlayerProjectile) {
            return  other == Define.Enemy;
        }

        if (tag == Define.EnemyProjectile) {
            return  other == Define.Player;
        }
        return false;
    }
}