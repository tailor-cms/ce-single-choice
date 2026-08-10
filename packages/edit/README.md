# @tailor-cms/ce-single-choice-edit

Authoring component for the **Single Choice** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Renders the element inside the Tailor authoring interface, where content is created and edited.

## Installation

```sh
npm install @tailor-cms/ce-single-choice-edit
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import { Edit } from '@tailor-cms/ce-single-choice-edit';
```

## Element

| Property | Value |
| --- | --- |
| Name | Single Choice |
| Type | `SINGLE_CHOICE` |
| Icon | [`mdi-order-bool-ascending`](https://pictogrammers.com/library/mdi/) |
| Composite | Yes |
| Question | Yes |

## Packages

This element ships as four packages, published together from the
[`ce-single-choice`](https://github.com/tailor-cms/ce-single-choice) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-single-choice-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-single-choice-manifest) | Shared element definition |
| [`@tailor-cms/ce-single-choice-edit`](https://www.npmjs.com/package/@tailor-cms/ce-single-choice-edit) | Authoring component |
| [`@tailor-cms/ce-single-choice-display`](https://www.npmjs.com/package/@tailor-cms/ce-single-choice-display) | End-user component |
| [`@tailor-cms/ce-single-choice-server`](https://www.npmjs.com/package/@tailor-cms/ce-single-choice-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
