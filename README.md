# Virtual Whiteboard

[![ci](https://github.com/enspour/virtual-whiteboard/actions/workflows/ci.yml/badge.svg)](https://github.com/enspour/virtual-whiteboard/actions/workflows/ci.yml)
[![cd](https://github.com/enspour/virtual-whiteboard/actions/workflows/cd.yml/badge.svg)](https://github.com/enspour/virtual-whiteboard/actions/workflows/cd.yml)

[Demo](https://enspour.github.io/virtual-whiteboard/workspace/online)

# Clone Of:

- [Excalidraw](https://excalidraw.com/)
- [Miro](https://miro.com/)

### Описание

Виртуальная масштабируемая доска, позволяющая пользователям создавать диаграммы.

### Требования к функциональности

- [x] Реализовать виртуальную доску (масштабирование, перемещение).
- [x] Реализовать инструменты для создания диаграмм (кисть, прямоугольник, эллипс, стрелка, текст, ластик).
- [x] Реализовать Undo / Redo.
- [x] Реализовать выделение, перемещение, изменение размера элементов диаграммы.

### Требования к проекту

- [x] Настроен CI/CD.
- [x] Использование Prettier.
- [x] Использование Eslint.
- [x] Использование стратегии OnPush.
- [x] Использование standalone компонентов.
- [x] Использование нового control flow.
- [x] Использование lazy routing ([App Routes](./src/app/app.routes.ts)).
- [x] Запуск кода вне zone.js ([Workspace Events](./src/modules/workspace/services/workspace/workspace-events.service.ts)).
- [x] Есть использование Directive ([ToolTip](./src/shared/components/ui/tooltip/tooltip.directive.ts), [Portals Controller](./src/shared/components/utils/portals/directives/portals-controller.directive.ts)).
- [x] Есть использование InjectionToken ([Portals Controller](./src/shared/components/utils/portals/directives/portals-controller.directive.ts))
- [x] Есть рендеринг списков с track ([Portal Host](./src/shared/components/utils//portals/components/portal-host/portal-host.component.html), [Toolkit](./src/modules/workspace/components/ui/header-toolkit/header-toolkit.component.html)).
- [x] Есть использование ChangeDetectorRef ([Header Toolkit](./src/modules/workspace/components/ui/header-toolkit/header-toolkit.component.ts)).

### Technical Stack

- Angular 17
