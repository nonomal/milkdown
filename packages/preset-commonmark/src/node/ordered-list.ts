import { createNode } from '@milkdown/utils';
import { wrapIn } from 'prosemirror-commands';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { SupportedKeys } from '..';

type Keys = SupportedKeys['OrderedList'];

const id = 'ordered_list';
export const orderedList = createNode<Keys>((_, utils) => ({
    id,
    schema: {
        content: 'listItem+',
        group: 'block',
        attrs: {
            order: {
                default: 1,
            },
        },
        parseDOM: [
            {
                tag: 'ol',
                getAttrs: (dom) => {
                    if (!(dom instanceof HTMLElement)) {
                        throw new Error();
                    }
                    return { order: dom.hasAttribute('start') ? Number(dom.getAttribute('start')) : 1 };
                },
            },
        ],
        toDOM: (node) => [
            'ol',
            {
                ...(node.attrs.order === 1 ? {} : node.attrs.order),
                class: utils.getClassName(node.attrs, 'ordered-list'),
            },
            0,
        ],
    },
    parser: {
        match: ({ type, ordered }) => type === 'list' && !!ordered,
        runner: (state, node, type) => {
            state.openNode(type).next(node.children).closeNode();
        },
    },
    serializer: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
            state.openNode('list', undefined, { ordered: true, start: 1 });
            state.next(node.content);
            state.closeNode();
        },
    },
    inputRules: (nodeType) => [
        wrappingInputRule(
            /^(\d+)\.\s$/,
            nodeType,
            (match) => ({ order: Number(match[1]) }),
            (match, node) => node.childCount + node.attrs.order === Number(match[1]),
        ),
    ],
    commands: (nodeType) => ({
        [SupportedKeys.OrderedList]: {
            defaultKey: 'Mod-Shift-7',
            command: wrapIn(nodeType),
        },
    }),
}));
