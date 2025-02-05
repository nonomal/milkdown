import type { Plugin as ProsemirrorPlugin } from 'prosemirror-state';
import { createCtx } from '../context';
import type { MilkdownPlugin } from '../utility';

export const prosePluginsCtx = createCtx<ProsemirrorPlugin[]>([]);

export const prosePluginFactory =
    (plugin: ProsemirrorPlugin | ProsemirrorPlugin[]): MilkdownPlugin =>
    () =>
    (ctx) => {
        ctx.update(prosePluginsCtx, (prev) => prev.concat([plugin].flat()));
    };
