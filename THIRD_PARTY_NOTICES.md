# SIM-ONE Alpha Third-Party Notices

SIM-ONE Alpha is licensed under the [MIT License](LICENSE). It also distributes
or integrates third-party software and model assets under their own licenses.
Those licenses apply to their respective components and are not replaced by the
SIM-ONE Alpha license.

Release archives and installers must retain this file and the applicable
upstream license files.

## Primary Components

| Component | Version or revision | License | Project |
| --- | --- | --- | --- |
| Flue packages | 1.0.0-beta.1 | Apache-2.0 | [withastro/flue](https://github.com/withastro/flue) |
| Ratatui | 0.30.2 | MIT | [ratatui/ratatui](https://github.com/ratatui/ratatui) |
| ratatui-textarea | 0.9.2 | MIT | [ratatui/ratatui](https://github.com/ratatui/ratatui) |
| Apache Arrow | 18.1.0 | Apache-2.0 | [apache/arrow](https://github.com/apache/arrow) |
| node-liblzma | 2.2.0 | LGPL-3.0 | [oorabona/node-liblzma](https://github.com/oorabona/node-liblzma) |
| all-MiniLM-L6-v2 | `1110a243fdf4706b3f48f1d95db1a4f5529b4d41` | Apache-2.0 | [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) |

The JavaScript and Rust lockfiles contain the complete dependency versions for
this release. Installed npm packages and Cargo crates retain their own license
files and copyright notices.

## Flue

SIM-ONE Alpha is built on Flue and uses the Flue runtime, Telegram connector,
SDK, React integration, and CLI packages. Flue is licensed under
[Apache License 2.0](https://github.com/withastro/flue/blob/main/LICENSE).

## Ratatui

The SIM-ONE terminal UI uses Ratatui and ratatui-textarea. Ratatui is licensed
under the MIT License.

```text
Copyright (c) 2016-2022 Florian Dehau
Copyright (c) 2023-2025 The Ratatui Developers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Local Embedding Model

The local embedding provider uses the
[all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
model at the pinned revision shown above. Hugging Face model metadata declares
the model under Apache License 2.0. Installers or archives that bundle the model
must include the [Apache License 2.0 text](https://www.apache.org/licenses/LICENSE-2.0).

## node-liblzma

`node-liblzma` is a transitive production dependency used through the Flue
runtime dependency graph. It is licensed under the
[GNU Lesser General Public License version 3](https://github.com/oorabona/node-liblzma/blob/master/LICENSE).
Distributions that include it must retain its license and provide the source
and relinking rights required by that license. The upstream source and license
are available from [oorabona/node-liblzma](https://github.com/oorabona/node-liblzma).

## Apache Arrow Notice

SIM-ONE Alpha uses Apache Arrow through LanceDB. The following notice is
reproduced from `apache-arrow@18.1.0`:

```text
Apache Arrow
Copyright 2016-2024 The Apache Software Foundation

This product includes software developed at
The Apache Software Foundation (http://www.apache.org/).

This product includes software from the SFrame project (BSD, 3-clause).
* Copyright (C) 2015 Dato, Inc.
* Copyright (c) 2009 Carnegie Mellon University.

This product includes software from the Feather project (Apache 2.0)
https://github.com/wesm/feather

This product includes software from the DyND project (BSD 2-clause)
https://github.com/libdynd

This product includes software from the LLVM project
 * distributed under the University of Illinois Open Source

This product includes software from the google-lint project
 * Copyright (c) 2009 Google Inc. All rights reserved.

This product includes software from the mman-win32 project
 * Copyright https://code.google.com/p/mman-win32/
 * Licensed under the MIT License;

This product includes software from the LevelDB project
 * Copyright (c) 2011 The LevelDB Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * Moved from Kudu http://github.com/cloudera/kudu

This product includes software from the CMake project
 * Copyright 2001-2009 Kitware, Inc.
 * Copyright 2012-2014 Continuum Analytics, Inc.
 * All rights reserved.

This product includes software from https://github.com/matthew-brett/multibuild (BSD 2-clause)
 * Copyright (c) 2013-2016, Matt Terry and Matthew Brett; all rights reserved.

This product includes software from the Ibis project (Apache 2.0)
 * Copyright (c) 2015 Cloudera, Inc.
 * https://github.com/cloudera/ibis

This product includes software from Dremio (Apache 2.0)
  * Copyright (C) 2017-2018 Dremio Corporation
  * https://github.com/dremio/dremio-oss

This product includes software from Google Guava (Apache 2.0)
  * Copyright (C) 2007 The Guava Authors
  * https://github.com/google/guava

This product include software from CMake (BSD 3-Clause)
  * CMake - Cross Platform Makefile Generator
  * Copyright 2000-2019 Kitware, Inc. and Contributors

The web site includes files generated by Jekyll.

--------------------------------------------------------------------------------

This product includes code from Apache Kudu, which includes the following in
its NOTICE file:

  Apache Kudu
  Copyright 2016 The Apache Software Foundation

  This product includes software developed at
  The Apache Software Foundation (http://www.apache.org/).

  Portions of this software were developed at
  Cloudera, Inc (http://www.cloudera.com/).

--------------------------------------------------------------------------------

This product includes code from Apache ORC, which includes the following in
its NOTICE file:

  Apache ORC
  Copyright 2013-2019 The Apache Software Foundation

  This product includes software developed at
  The Apache Software Foundation (http://www.apache.org/).

  This product includes software developed by Hewlett-Packard:
  (c) Copyright [2014-2015] Hewlett-Packard Development Company, L.P
```

## Complete Dependency Licenses

This notice highlights the components that need explicit release visibility. It
does not replace the copyright and license terms attached to every transitive
dependency. When redistributing SIM-ONE Alpha:

- preserve license and notice files installed with npm packages and Cargo
  crates;
- include the Apache-2.0 license with Apache-licensed bundled code and model
  assets;
- retain MIT, BSD, ISC, Zlib, Unicode, and other permissive notices applicable
  to compiled dependencies;
- retain LGPL-3.0 materials and source/relinking information when
  `node-liblzma` is included.
