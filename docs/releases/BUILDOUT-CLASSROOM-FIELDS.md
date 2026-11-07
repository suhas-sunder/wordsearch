# Classroom instructions and blank class field

Review-only child of integration03. Adds an optional blank Class line beside
Name/Date on student worksheets, and optional custom worksheet instructions.
The default remains the accurate permitted-direction text. UI explains that
custom instructions replace that text; it never invents different directions.
Instructions accept up to180 printable English/ASCII characters; unsupported
text rejects before generation. No student/class names are collected or stored.

Only measured pack/large-print layouts support the extra field. The renderer
reserves its header height and keeps teacher answer sheets free of student
fields and custom instructions. This changes neither placement algorithms nor
default/historical output bytes. Local presets retain these choices, while old
version1 presets remain valid and load with default blank instructions/no class
line. Exact seeded grids remain the same with or without instructional text.

Node22.23.4 validation November6: lint/typecheck388tests, production build335
pages/static-host217/35/6 and whitespace checks PASS. Real Letter/A4 tests
exercise standard and large-print layouts, every student/teacher pair, complete
instruction text, header/grid clearance and zero measured findings. Legacy
PDF byte and150 published puzzle fingerprints pass.

Browser classroom-fields test on3395 downloads both paper formats and verifies
all student/teacher labels and paired grids; reload restores class/instructions
and large-type choices. Existing5/10/20 pack, preset corruption/storage and
large-print browser suites also PASS. Rendered Letter/A4 student pages visually
inspected with Poppler: clear separated Name/Date/Class, full instruction text,
readable grid/bank and unclipped footer. Poppler's system Symbol-font warning
does not affect these Latin samples. Artifacts remain outside the repository.

Dense lists or long instructions/titles may still fail measured fit and retain
entries for correction. Physical printers, real-device/manual accessibility,
protected ad-network and independent release review remain separate gates.
No publication/main/deployment/auto-merge. Rollback by excluding/reverting this
package; defaults and existing saved preset format remain compatible.
