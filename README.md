# MiroClone

[Demo]()

# Вдохновлен:

- [Excalidraw](https://excalidraw.com/)
- [Miro](https://miro.com/)

### Описание

Виртуальная масштабируемая доска, позволяющая пользователям создавать диаграммы.

### Требования к функциональности

- [x] Реализовать виртуальную доску (масштабирование, перемещение).
- [x] Реализовать инструменты для создания диаграмм (кисть, прямоугольник, эллипс, стрелка, текст, ластик).
- [x] Реализовать Undo / Redo.
- [ ] Реализовать выделение, перемещение, изменение размера элементов диаграммы.

### Требования к проекту

- [ ] Настроен CI/CD.
- [x] Использование Prettier.
- [x] Использование Eslint.
- [x] Использование стратегии OnPush.
- [x] Использование standalone компонентов.
- [x] Использование нового control flow.
- [x] Использование lazy routing ([App](./src/app/app.routes.ts)).
- [x] Запуск кода вне zone.js ([Events](./src/modules/workspace/services/events.service.ts)).
- [x] Есть использование Directive ([ToolTip](./src/shared/components/ui/tooltip/tooltip.directive.ts), [PortalsController](./src/shared/components/utils/portals/directives/portals-controller.directive.ts)).
- [x] Есть использование InjectionToken ([PortalsController](./src/shared/components/utils/portals/directives/portals-controller.directive.ts))
- [x] Есть рендеринг списков с track ([Portal](./src/shared/components/utils//portals/components/portal-host/portal-host.component.html), [Toolkit](./src/modules/workspace/components/ui/header-toolkit/header-toolkit.component.html)).
- [x] Есть использование ChangeDetectorRef ([HeaderToolkit](./src/modules/workspace/components/ui/header-toolkit/header-toolkit.component.ts)).

### Technical Stack

- Angular 17
