"""Original OpenEngineering mechanical parts. Run with Blender --background --python.
Geometry uses metres only as a convenient scene unit; this is a teaching assembly.
The engine kinematics in src/lib/mechanics.ts define all moving pivots.
"""
import bpy, math, os
from mathutils import Vector
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
materials={}
def mat(name,color,metal,rough):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 materials[name]=m;return m
mat('Gear steel',(.19,.24,.29),.94,.32)
mat('Machined steel',(.48,.53,.57),.92,.22);mat('Cast aluminum',(.32,.36,.39),.78,.38)
mat('Dark iron',(.065,.083,.095),.8,.3);mat('Ceramic',(.9,.88,.8),.05,.2)
mat('Copper',(.54,.23,.1),.82,.24);mat('Rubber',(.015,.023,.027),.05,.69)
mat('Intake blue',(.075,.3,.37),.62,.29);mat('Exhaust copper',(.51,.15,.045),.65,.3)
parts={}
def finish(o,material,bevel=.025):
 o.data.materials.append(materials[material])
 if o.type=='MESH':
  for p in o.data.polygons:p.use_smooth=True
  if bevel:
   b=o.modifiers.new('Machined edge','BEVEL');b.width=bevel;b.segments=3
   bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=b.name)
  n=o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL');n.keep_sharp=True
  try:bpy.ops.object.modifier_apply(modifier=n.name)
  except:pass
 return o

def cyl(r,depth,loc=(0,0,0),material='Machined steel',axis='Y',verts=64,bevel=.02):
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=depth,location=loc)
 o=bpy.context.object
 if axis=='Y':o.rotation_euler[0]=math.pi/2
 if axis=='X':o.rotation_euler[1]=math.pi/2
 bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
 return finish(o,material,bevel)
def box(size,loc=(0,0,0),material='Cast aluminum',bevel=.035):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,material,bevel)
def torus(r,t,loc=(0,0,0),material='Machined steel',axis='Y'):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=64,minor_segments=8,location=loc);o=bpy.context.object
 if axis=='Y':o.rotation_euler[0]=math.pi/2
 if axis=='X':o.rotation_euler[1]=math.pi/2
 bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);return finish(o,material,0)
def mesh(name,verts,faces,material,bevel=.01):
 m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);return finish(o,material,bevel)
def tube_curve(points,r,material):
 curve=bpy.data.curves.new('Flow passage','CURVE');curve.dimensions='3D';curve.resolution_u=18;curve.bevel_depth=r;curve.bevel_resolution=4
 if len(points)>12:
  s=curve.splines.new('POLY');s.points.add(len(points)-1)
  for b,p in zip(s.points,points):b.co=(*p,1)
 else:
  s=curve.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
  for b,p in zip(s.bezier_points,points):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new('Pipe',curve);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);return finish(o,material,0)
def join(name,objs):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.select_set(True)
 bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=objs[0];o.name=name
 bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR');parts[name]=o;o.select_set(False);return o

def shell(ro,ri,height,arc=math.pi*1.1,material='Cast aluminum'):
 verts=[];faces=[];N=80;start=-arc/2
 for y in [-height/2,height/2]:
  for r in [ro,ri]:
   for i in range(N+1):
    a=start+arc*i/N;verts.append((math.sin(a)*r,y,-math.cos(a)*r))
 for i in range(N):
  for band in [(0,2),(1,3),(0,1),(2,3)]:
   a=band[0]*(N+1)+i;b=band[1]*(N+1)+i;faces.append((a,a+1,b+1,b))
 for i in [0,N]:faces.append((i,N+1+i,3*(N+1)+i,2*(N+1)+i))
 return mesh('Cutaway',verts,faces,material,.014)

# Piston: ring lands, recessed skirt, wrist pin and crown.
join('Piston',[cyl(.59,.49,(0,-.04,0)),cyl(.635,.14,(0,.245,0)),*[torus(.622,.018,(0,y,0),'Dark iron') for y in [.135,.185,.235]],cyl(.15,1.28,(0,-.07,0),'Dark iron','Z'),torus(.16,.035,(0,-.07,.64),axis='Z'),torus(.16,.035,(0,-.07,-.64),axis='Z')])
# Rod pivot is the crank pin; +Y points toward the wrist pin, length 2.08.
join('ConnectingRod',[box((.26,1.85,.16),(0,1.04,0),'Machined steel',.06),box((.11,1.65,.23),(0,1.04,0),'Dark iron',.025),cyl(.27,.3,(0,0,0),axis='Z'),torus(.20,.055,(0,0,.16),axis='Z'),cyl(.19,.27,(0,2.08,0),axis='Z'),torus(.125,.038,(0,2.08,.14),axis='Z'),*[cyl(.055,.11,(x,-.19,.19),'Dark iron','Z',6,.007) for x in [-.17,.17]]])
join('CrankWeb',[box((.40,.84,.20),(0,.29,0),'Dark iron',.13),cyl(.49,.23,(0,-.24,0),'Dark iron','Z'),cyl(.23,.24,(0,.72,0),'Machined steel','Z')])
join('CrankPin',[cyl(.185,1.05,material='Machined steel',axis='Z')])
join('CylinderShell',[shell(.79,.70,1.95)])
join('CylinderCollar',[shell(.84,.7,.10,material='Machined steel')])
join('Head',[box((1.77,.24,.62),(0,0,-.43)),box((.25,.31,1.42),(-.78,0,0)),box((.25,.31,1.42),(.78,0,0)),*[cyl(.085,.12,(x,.17,z),'Dark iron','Y',6,.012) for x in [-.78,.78] for z in [-.54,.54]],*[box((1.72,.045,.75),(0,.05+y,-.49),bevel=.008) for y in [.20,.29,.38]]])
join('Valve',[cyl(.228,.065,(0,0,0),'Machined steel'),cyl(.041,.80,(0,.4,0),'Machined steel'),cyl(.105,.06,(0,.72,0),'Dark iron')])
# Unit-height helical spring is compressed by the renderer between fixed seats.
points=[]
for i in range(257):
 t=i/256;a=t*math.pi*2*7;points.append((.115*math.cos(a),t,.115*math.sin(a)))
join('ValveSpring',[tube_curve(points,.017,'Dark iron')])
# A quarter-turn radial lobe matches the ideal sinusoidal valve lift.
cv=[];cf=[];N=128
for z in [-.08,.08]:
 for i in range(N):
  a=i*2*math.pi/N;u=(a+math.pi/2)%(2*math.pi)
  r=.22+(.3*math.sin(2*u) if u<math.pi/2 else 0)
  cv.append((r*math.cos(a),r*math.sin(a),z))
cf.extend([tuple(range(N-1,-1,-1)),tuple(range(N,2*N))])
for i in range(N):cf.append((i,(i+1)%N,(i+1)%N+N,i+N))
join('CamLobe',[mesh('Radial cam',cv,cf,'Dark iron',.008)])
join('SparkPlug',[cyl(.08,.38,(0,.47,0),'Ceramic'),*[torus(.084,.015,(0,y,0),'Ceramic') for y in [.4,.46,.52,.58]],cyl(.13,.12,(0,.24,0),'Machined steel','Y',6),cyl(.083,.19,(0,.095,0),'Machined steel'),cyl(.019,.08,(0,-.03,0),'Copper'),tube_curve([(.075,.02,0),(.07,-.09,0),(.026,-.095,0)],.014,'Machined steel'),cyl(.05,.10,(0,.7,0),'Dark iron')])
def passage(sign, material):
 # Hollow, open-front passage. The cutaway makes flow visible without x-ray overlays.
 verts=[];faces=[];N=36;A=24
 controls=[Vector((sign*1.58,.38,-.1)),Vector((sign*1.02,.38,-.05)),Vector((sign*.49,.15,0)),Vector((sign*.38,-.10,0))]
 for i in range(N+1):
  t=i/N;p=controls[0]*(1-t)**3+controls[1]*3*(1-t)**2*t+controls[2]*3*(1-t)*t*t+controls[3]*t**3
  tangent=((controls[1]-controls[0])*3*(1-t)**2+(controls[2]-controls[1])*6*(1-t)*t+(controls[3]-controls[2])*3*t*t).normalized()
  normal=Vector((-tangent.y,tangent.x,0)).normalized()
  for r in [.19,.15]:
   for j in range(A+1):
    a=-math.pi*.65+math.pi*1.3*j/A
    point=p+normal*(r*math.sin(a))+Vector((0,0,-r*math.cos(a)))
    verts.append(tuple(point))
 stride=2*(A+1)
 for i in range(N):
  for b in [0,1]:
   for j in range(A):
    k=i*stride+b*(A+1)+j;faces.append((k,k+1,k+stride+1,k+stride))
  for j in [0,A]:
   k=i*stride+j;faces.append((k,k+A+1,k+stride+A+1,k+stride))
 for i in [0,N]:
  for j in range(A):
   k=i*stride+j;faces.append((k,k+1,k+A+2,k+A+1))
 return mesh('Open passage',verts,faces,material,.006)
for name,s,material in [('IntakePort',-1,'Intake blue'),('ExhaustPort',1,'Exhaust copper')]:
 join(name,[passage(s,material),torus(.19,.035,(s*1.58,.38,-.1),material,'X')])
join('Flywheel',[cyl(.99,.17,material='Dark iron',axis='Z'),torus(.88,.09,material='Machined steel',axis='Z'),cyl(.32,.31,material='Machined steel',axis='Z'),*[cyl(.048,.10,(.55*math.cos(a),.55*math.sin(a),.13),'Machined steel','Z',6,.006) for a in [i*math.pi/3 for i in range(6)]]])
join('Bearing',[torus(.24,.065,material='Machined steel',axis='Z'),torus(.36,.075,material='Cast aluminum',axis='Z'),*[b for x in [-.40,.40] for b in [box((.20,.21,.28),(x,-.20,0)),cyl(.055,.14,(x,-.06,0),'Dark iron','Y',6,.008)]]])

def gear(teeth,r,depth,bevel=False):
 # Standard module proportions; narrowed teaching teeth, not manufacturing profiles.
 module=2*r/teeth;verts=[];faces=[]
 for z in [-depth/2,depth/2]:
  for t in range(teeth):
   for f,rr in [(0,r-1.2*module),(.18,r-1.2*module),(.36,r+module),(.64,r+module),(.82,r-1.2*module)]:
    a=(t+f)*2*math.pi/teeth;verts.append((rr*math.cos(a),rr*math.sin(a),z))
 N=len(verts)//2
 faces.append(tuple(range(N-1,-1,-1)));faces.append(tuple(range(N,N*2)))
 for i in range(N):faces.append((i,(i+1)%N,(i+1)%N+N,i+N))
 o=mesh('Gear',verts,faces,'Gear steel',.013)
 if teeth in [32,48]:
  for i in range(6):
   a=i*math.pi/3
   cutter=cyl(r*.135,depth*4,(r*.55*math.cos(a),r*.55*math.sin(a),0),axis='Z',verts=32,bevel=0)
   bpy.context.view_layer.objects.active=o
   mod=o.modifiers.new('Lightening bore','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cutter
   bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
 for face in o.data.polygons:
  if abs(face.normal.z) > .9:face.use_smooth=False
 return o
for teeth in [16,32,48]:
 r=teeth*.0475
 join('Gear'+str(teeth),[gear(teeth,r,.25),cyl(.25,.43,material='Dark iron',axis='Z'),torus(.20,.022,(0,0,.23),axis='Z'),torus(r*.78,.016,(0,0,.143),axis='Z')])
join('RingGear',[gear(40,1.43,.22),torus(1.22,.075,(0,0,.12),'Dark iron',axis='Z'),*[cyl(.045,.06,(1.08*math.cos(a),1.08*math.sin(a),.14),'Dark iron','Z',6,.006) for a in [i*math.pi/4 for i in range(8)]]])
def bevelgear(name,teeth,r,axis_distance):
 objs=[cyl(r*.62,axis_distance*.38,material='Machined steel')]
 for t in range(teeth):
  a=t*2*math.pi/teeth;da=math.pi/teeth*.34
  vv=[]
  for y,rad,w in [(-axis_distance*.19,r,.95),(axis_distance*.19,r*.62,.72)]:
   for rr,ang in [(rad-.15,a-da*w),(rad+.025,a-da*w),(rad+.025,a+da*w),(rad-.15,a+da*w)]:vv.append((rr*math.sin(ang),y,rr*math.cos(ang)))
  objs.append(mesh('Bevel tooth',vv,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],'Machined steel',.012))
 objs.append(torus(r*.38,.022,(0,axis_distance*.19+.008,0),'Copper'))
 join(name,objs)
bevelgear('SideGear',16,.76,.57);bevelgear('SpiderGear',12,.57,.76)
join('Carrier',[shell(1.24,1.08,2.45,math.pi*1.10,'Dark iron'),*[box((.22,.30,1.85),(s*1.1,-.23,-.08),'Cast aluminum',.05) for s in [-1,1]]])
join('Wheel',[cyl(.84,.32,material='Rubber'),cyl(.53,.36,material='Dark iron'),torus(.47,.036,(0,.20,0)),cyl(.22,.44,material='Machined steel')])
# Store every part at its mechanical pivot in the GLB library.
bpy.ops.object.select_all(action='DESELECT')
for o in parts.values():o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/mechanical-parts.glb'),export_format='GLB',use_selection=True,export_yup=False,export_apply=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
# Editable source: library parts laid out on a grid, names and pivots retained.
for i,o in enumerate(parts.values()):o.location=((i%6)*4,(i//6)*5,0)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/source/mechanical-parts.blend'))
# Compact original equirectangular studio reflection map, no external textures.
W,H=256,128;im=bpy.data.images.new('OpenEngineering studio',width=W,height=H,float_buffer=True)
pix=[]
for y in range(H):
 for x in range(W):
  u=x/W;v=y/H
  def panel(cx,cy,sx,sy):return math.exp(-((u-cx)/sx)**8-((v-cy)/sy)**8)
  key=panel(.18,.37,.045,.21)*5.5;fill=panel(.68,.36,.11,.08)*2.4;rim=panel(.88,.49,.018,.28)*7
  pix.extend((.028+key+fill*.8+rim,.035+key*.96+fill*.92+rim*.75,.04+key*.90+fill+rim*.55,1))
im.pixels=pix;im.filepath_raw=str(ROOT/'public/environments/studio.hdr');im.file_format='HDR';im.save()
print('Exported',len(parts),'original parts')

# A second editable source shows the assembled single cylinder at 430 degrees.
for o in parts.values():o.hide_set(True);o.hide_render=True
assembly=bpy.data.collections.new('Engine assembly · phase 430');bpy.context.scene.collection.children.link(assembly)
def instance(name,loc=(0,0,0),rot=(0,0,0),scale=(1,1,1)):
 o=parts[name].copy();o.data=parts[name].data.copy();assembly.objects.link(o);o.location=loc;o.rotation_euler=rot;o.scale=scale;o.hide_set(False);o.hide_render=False;return o
a=math.radians(430);x=.72*math.sin(a);y=.72*math.cos(a);py=y+math.sqrt(2.08**2-x*x)
instance('Piston',(0,py,0));instance('CylinderShell',(0,2.35,0))
for cy in [1.4,3.3]:instance('CylinderCollar',(0,cy,0))
r=instance('ConnectingRod',(x,y,0));r.rotation_mode='QUATERNION';r.rotation_quaternion=Vector((0,1,0)).rotation_difference(Vector((-x,py-y,0)).normalized())
for z in [-.48,.48]:instance('CrankWeb',(0,0,z),(0,0,-a))
instance('CrankPin',(x,y,0));instance('Flywheel',(0,0,-1.24));instance('Bearing',(0,0,-.85));instance('Head',(0,3.4,0));instance('SparkPlug',(0,3.18,0));instance('IntakePort',(0,3.4,0));instance('ExhaustPort',(0,3.4,0))
for j,x in enumerate([-.38,.38]):
 instance('Valve',(x,3.17,0));instance('ValveSpring',(x,3.44,0),scale=(1,.47,1));instance('CamLobe',(x,4.13,0),(0,0,-a/2+(1.5*math.pi if j else 0)))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/source/engine-assembly.blend'))
